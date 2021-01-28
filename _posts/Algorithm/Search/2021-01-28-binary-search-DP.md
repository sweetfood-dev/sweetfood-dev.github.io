---
title: 이진 탐색
categories:
- Algorithm
- Search
- LIS
---

**정렬된 배열**에서 원소 x를 찾고자 할 때 사용<br>

1. 찾고자 하는 x를 중간 원소와 비교
2. x가 중간 원소보다 크다면 오른쪽 절반을
3. x가 중간 원소보다 작다면 왼쪽 절반을 재탐색한다
4. 1 ~ 3과정을 x를 찾거나 부분 배열의 크기가 0이 될 때까지 반복한다

**코드**

```
func binarySearch(arr: [Int], find: Int) -> Int {
    var low = 0
    var high = arr.count - 1
    var mid : Int
    
    while low <= high {
        mid = (low + high) / 2
        if arr[mid] > find {
            high = mid - 1
        }else if arr[mid] < find {
            low = mid + 1
        }else {
            return mid
        }
    }
    return -1
}

```
