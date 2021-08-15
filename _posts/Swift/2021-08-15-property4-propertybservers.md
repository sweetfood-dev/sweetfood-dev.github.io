---
title: "[Swift] 플퍼티 관찰자 (Property Observers)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Property
toc: true
toc_sticky: true
toc_label: 목차
---
## 프로퍼티 관찰자란?

프로퍼티 값을 관찰하다가 **변화에 반응**하는 놈이에요

설령 같은 값이 들어와도 관찰자가 호출되어집니다.

프로퍼티 옵저버는 추후에 학습할 상속받은 저장 프로퍼티와 사용자가 정의한 저장 프로퍼티 처럼

**저장 프로퍼티에서만 사용** 할 수 있어요!

연산 프로퍼티에서 사용하고 싶다면 setter를 이용하면 비슷한 기능을 할 수 있으니 너무 

실망하지는 마세요!

## 옵저버의 종류

### willSet

새로운 값이 프로퍼티에 **저장되기 직전 호출**되는 옵저버에요

즉, 아직 프로퍼티의 값 이 변경되지 않은 상태인거죠.

새 값으로 설정될 값이 매개변수로 전달되어 지는데 이 매개변수 이름을 정해줄 수도 있고

정해 주지 않으면 연산 프로퍼티의 setter에서 처럼 **newValue**로 사용할 수 있습니다!

```swift
class StepCounter {
	var totalSteps = 0 {
		willSet(steps) {
            print("new Total Steps = \(steps)")
		}
	}
}

let counter = StepCounter()
counter.totalSteps = 5
// "new Total Steps = 5"
```

```swift
class StepCounter {
	var totalSteps = 0 {
		willSet {
			print("new Total Steps = \(newValue)")
		}
	}
}

let counter = StepCounter()
counter.totalSteps = 5
// "new Total Steps = 5"
```

위는 매개변수명을 정해준 경우고 아래의 코드는 매개변수명을 생략한 코드에요. 모두 잘 출력 되는걸 확인 할 수 있습니다!

### didSet

didSet은 새로운 값이 프로퍼티에 **저장된 직후에 호출**되는 옵저버에요

그 외에 매개변수명도 똑같이 지정가능하고 생략할 때는 **oldValue**로 사용할 수 있습니다!

```swift
class StepCounter {
	var totalSteps = 0 {
		willSet {
			print("new Total Steps = \(newValue)")
		}
		didSet {
			if totalSteps > oldValue {
				print("add \(totalSteps - oldValue) steps")
			}
		}
	}
}

let counter = StepCounter()
counter.totalSteps = 5
// "new Total Steps = 5"
// "add 5 steps"
counter.totalSteps = 105
// "new Total Steps = 105"
// "add 100 steps"
```

## 주의점

초기화중에 didSet 그리고 willSet은 호출되지 않아요!

옵저버는 **초기화가 완료된 인스턴스에서만 호출**되어진다고 해요

let으로 사용되는 **상수는 초기화 중에 값이 할당**되어 지기 때문에

자연스레 프로퍼티 옵저버는 변수 프로퍼티에만 사용할 수 있겠죠?

```swift
class Foo {
	var age = 0 {
		willSet { print("willSet \(newValue)") }
		didSet { print("didSet \(age) oldAge = \(oldValue)") }
	}
}

// 초기화 단계에서는 옵저버 호출이 안된다
let f = Foo()
// 초기화가 완료된 인스턴스에서 옵저버 호출
f.age = 15 
// willSet 15
// didSet 15 oldAge = 0
```

## 정리

1. 프로퍼티 옵저버는 저장 프로퍼티에서만 사용 가능 하다
2. 연산 프로퍼티에서는 setter를 사용하자
3. willSet은 저장되기 직 전 호출
4. didSet은 저장된 직 후 호출 
5. 초기화 과정에서 옵저버는 호출되지 않는다
6. 초기화 완료된 인스턴스에서만 호출 가능
