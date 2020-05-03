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

}

inline char* replaceAll(const char* str, const char* from, const char* to) {

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