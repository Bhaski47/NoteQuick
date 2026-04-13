package com.notequick.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;


import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateTokenForUser(Map<String,Object> claims,UserDetails userDetails) {
        return generateToken(claims,userDetails);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token,UserDetails userDetails){
        final String userName = extractUserNameFromToken(token);
        return userName.equals(userDetails.getUsername()) && isBeforeExpiration(token);
    }

    private boolean isBeforeExpiration(String token) {
        return new Date().before(extractClaim(token,Claims::getExpiration));
    }

    private String extractUserNameFromToken(String token){
        return extractClaim(token,Claims::getSubject);
    }

    public String extractEmailFromToken(String token){
//        HashMap<String,Object> claims = extractAllClaimsFromToken(token).get("userDetails", HashMap.class);
        return extractAllClaimsFromToken(token).getSubject();
    }

    private Claims extractAllClaimsFromToken(String token) {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired");
        } catch (MalformedJwtException | io.jsonwebtoken.security.SignatureException e) {
            throw new JwtException("Invalid token");
        } catch (Exception e) {
            throw new JwtException("Token validation failed");
        }
    }

    public String extractUserId(String token) {
        String authToken = getJwtToken(token);
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .build()
                .parseSignedClaims(authToken)
                .getBody();

        return claims.get("userId", String.class);
    }

    private String getJwtToken(String token) {

        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }

}
