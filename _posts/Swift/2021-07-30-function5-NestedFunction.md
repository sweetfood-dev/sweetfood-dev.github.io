---
title: "[Swift] Function(5) 중첩된 함수 (Nested Functions)"
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

# Nested Functions

함수 본문 내부에 함수를 정의하여 사용할 수 있다.

기본적으로 함수 내부에 정의된 중첩 함수는 내부에서만 사용가능하지만 

해당 함수를 Return하면 외부에서도 해당 함수를 사용할 수 있다.

```swift
func chooseStepFunction(backward: Bool) -> (Int) -> Int {
	func stepForward(input: Int) -> Int { return input + 1 }
	func stepBackward(input: Int) -> Int { return input - 1 }
	func foo() { print("Nested Function") }
	foo()
	return backward ? stepBackward : stepForward
}
var currentValue = -4
let moveNearerToZero = chooseStepFunction(backward: currentValue > 0)
// moveNearerToZero now refers to the nested stepForward() function
while currentValue != 0 {
    print("\(currentValue)... ")
    currentValue = moveNearerToZero(currentValue)
}

print("Zero!")
// Nested Function
// -4...
// -3...
// -2...
// -1...
// Zero!
```
