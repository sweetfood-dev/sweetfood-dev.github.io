---
title: "[Swift] Function(4) 함수 타입(Function Type)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Function
toc: true
toc_sticky: true
toc_label: 목차
---


# 함수 타입

Swift에서는 함수를 Int, String과 같은 다른 타입들 처럼 변수 / 상수에 할당할 수 있다.

이 말은 **함수를 하나의 타입으로 사용**할 수 있다라는 것이다.

```swift
var intType: Int
var stringType: String
var funcType: func // ???????????
```

그렇다면 함수 타입은 어떻게 선언을 해줘야 하나..?

함수의 타입은 인자레이블의 타입, 반환값의 타입을 구성하여 나타낸다. 코드로 보면 이해가 더 빠르니 코드로 봐보자!

```swift
// type : (Int, String) -> Void
func foo(_ num: Int, from address: String) { }
// type : (Int, String) -> [Int]
func foo2(num val: Int, at home: String) -> [Int] { }
// type : (Double, [Int]) -> Bool
func foo3(_ param1: Double, _ param2: [Int]) -> Bool { }
```

주석으로 보면 알 수 있듯 함수의 이름과 인자레이블, 파라미터 이름을 다 생략하고 **타입만 나열**해준 것이 

바로 함수의 타입이다

모든 타입은 변수 혹은 상수로 사용이 가능하기 때문에 함수 역시 변수 / 상수에 할당이 가능한 것이다.

그렇다면 어떻게 사용할까? 변수 / 상수에 할당을 했다면은 레이블이 없는 함수처럼 사용이 가능하다.

```swift
// type : (Int, Int) -> Int
func addNumber(_ num1: Int, and num2: Int) -> Int {
    num1 + num2 // return 생략 가능
}

var mathFunction : (Int, Int) -> Int = addNumber
print(mathFunction(1, 2)) // 3 출력
```

여기서 함수의 타입을 미리 선언해 주었지만 **타입 추론도 가능**하여 생략이 가능하다.

함수의 타입만 같다면 다른 기능을 하는 함수(이름이 다른 함수)도 얼마든지 할당이 가능하다!

```swift
// type : (Int, Int) -> Int
func addNumber(_ num1: Int, and num2: Int) -> Int {
    num1 + num2 // return 생략 가능
}
func minusNumber(num1: Int, and num2: Int) -> Int {
    num1 - num2
}

var mathFunction : (Int, Int) -> Int = addNumber
print(mathFunction(1, 2)) // 3 출력
mathFunction = minusNumber // 다른 함수 할당 
print(mathFunction(2,1)) // 1 출력
```

타입이기 때문에 함수의 파라미터로도, 리턴 값에도 함수를 사용할 수 있다.

## 파라미터로서의 함수 타입

```swift
func foo(_ mathFunction: (Int, Int) -> Int, num1: Int, num2: Int) {
    let result = mathFunction(num1, num2)
    print(result)
}
```

## 리턴 타입으로서의 함수 타입

```swift
func stepBackward(_ value: Int) -> Int {
    value - 1
}

func stepForward(_ value: Int) -> Int {
    value + 1
}

// (Int) -> Int 타입의 함수를 리턴
func chooseStepFunction(backward: Bool) -> (Int) -> Int { 
    backward ? stepBackward : stepForward
}

var current = 3
let function = chooseStepFunction(backward: current > 0)
while current != 0 {
    print("current : \(current)")
    current = function(current)
}
```

> Swift의 타입은 값(value)타입과 참조(Reference)타입으로 나뉘는데 함수와 클래스는 참조 타입이다.
그래서 그런지 함수를 변수에 할당하거나 반환값에 함수를 적용할 때 Xcode에서 만들어주는 자동완성
목록에 stepForward(_:)가 있는데 아마 이 **함수의 이름**에도 **주소값**이 들어가 있는듯 하다
