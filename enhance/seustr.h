/**
 * seustr.h
 * Offered by seulex for better string processing experience.
 * Copy this header to a suitbale place you think.
 * You might need -I argument when using GCC to compile.
 * github.com/z0gSh1u/seu-lex-yacc
 */

#ifndef SEUSTR_H_
#define SEUSTR_H_

#include <string.h>
#include <stdlib.h>
#include <ctype.h>

inline char* substr(const char* str, int left, int len) {
    char *ret = new char[len + 1];
    for (int i = 0; i < len; i++) {
        ret[i] = str[left + i];
    }
    ret[len] = '\0';
    return ret;
}

inline char* substring(const char* str, int left, int right) {
    return substr(str, left, right - left);
}

inline char* trimLeft(const char* str) {
    int left = -1;
    while (isspace(str[++left]));
    int right = left - 1;
    while (str[++right] != '\0');
    return substring(str, left, right);
}

inline char* trimRight(const char* str) {
    int right = 0;
    for (int i = 0; str[i]; i++) {
        if (!isspace(str[i])) {
            right = i + 1;
        }
    }
    return substring(str, 0, right);
}

inline char* trim(const char* str) {
    return trimLeft(trimRight(str));
}

inline char* replaceOnce(const char* str, const char* from, const char* to) {
    char *p;
    p = (char *)strstr(str, from);
    if (p == NULL) {
        return strdup(str);
    }
    int str_len = strlen(str), from_len = strlen(from), to_len = strlen(to);
    char *ret = new char[str_len - from_len + to_len + 1];
    char *strptr, *retptr;
    for (strptr = (char *)str, retptr = ret; *strptr != '\0'; strptr++, retptr++) {
        if (strptr != p) {
            *retptr = *strptr;
        } else {
            strcpy(retptr, to);
            retptr += to_len;
            strptr += from_len;
        }
    }
    *retptr = '\0';
    return ret;
}

inline char* replaceAll(const char* str, const char* from, const char* to) {
    int str_len = strlen(str), from_len = strlen(from), to_len = strlen(to);
    int p_cnt = 0;
    char **ps = new char*[str_len];
    char *strptr = (char *)str;
    while (strptr != NULL) {
        strptr = strstr(strptr, from);
        if (strptr != NULL) {
            ps[p_cnt] = strptr;
            strptr += from_len;
        }
    }
    if (p_cnt == 0) {
        return strdup(str);
    }
    char *ret = new char[str_len - p_cnt * from_len + p_cnt * to_len + 1];
    char *retptr = ret;
    int pptr = 0;
    for (strptr = (char *)str; *strptr != '\0'; strptr++, retptr++) {
        if (pptr >= p_cnt || strptr != ps[pptr]) {
            *retptr = *strptr;
        } else {
            strcpy(retptr, to);
            retptr += to_len;
            strptr += from_len;
            pptr++;
        }
    }
    *retptr = '\0';
    return ret;
}

inline char* reverse(const char* str) {
    int p = -1;
    while (str[++p]);
    char *ret = new char[p + 1];
    ret[p--] = '\0';
    for (int i = 0; p >= 0; p--, i++) {
        ret[i] = str[p];
    }
    return ret;
}

#endif