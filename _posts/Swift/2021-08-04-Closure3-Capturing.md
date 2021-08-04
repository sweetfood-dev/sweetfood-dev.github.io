---
title: "[Swift] 클로저 캡처링(Closure Capturing)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Closure
toc: true
toc_sticky: true
toc_label: 목차
---

[클로저의 정의](https://sweetfood-dev.github.io/swift/Closure/)에서 

정의된 컨텍스트에서 상수와 변수에 대한 참조를 "**캡처**"하고 저장할 수 있다.

라고 했습니다.

오늘은 바로 그 캡처에 대해 알아보겠습니다!

## 캡쳐란?

네이버에서 검색한 캡처의 사전적 정의는

> 드라마 방송 따위의 움직이는 영상에서 원하는 장면을 편집하여 분리하는 행위.

그럼 원하는 상수와 변수를 분리한다는 건가? 뭐 그런 비슷한 늬앙스 같죠?

클로저는 주변 컨텍스트로부터 상수 혹은 변수를 캡쳐를 합니다.

주변 컨텍스트란게 제가 생각하기엔 클로저가 정의된 곳의 주변을 말하는거 같아요

예를 들어 

```swift
func foo() {
    var num = 10
    func nestedFoo() { // 중첩함수도 클로저의 한 형태죠		
    }
}
```

이러한 코드가 있을 때 nestedFoo의 주변 컨텍스트는 foo 함수 내부가 되는것 같아요.

다시 처음으로 돌아와 이 캡처된 상수 혹은 변수들은 클로저 내부에서 참조 혹은 수정을 할 수 있습니다.

애플에서 제시한 코드를 예로 들어 함께 이해해봅시다.

```swift
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}
```

makeIncrementer 함수는 Int 타입인 amount를 인수로 받고 함수가 종료될 때 () → Int 타입의 함수를 반환합니다.

내부 변수로는 Int타입의 runningTotal 변수와 중첩함수 incrementer를 가지고 있습니다.

중첩함수 incrementer는 makeIncrementer의 파라미터 amount와 내부 변수 runningTotal을 연산시켜서 그 값을 반환하는 함수이구요. 이때 사용하는 amount와 runningTotal은 중첩함수에서 주변 컨텍스트인 makeIncrementer에서 캡처한 변수와 상수입니다!

> 파라미터(인수) amount는 상수고 runningTotal은 var로 선언하였으니 변수겠죠?

이게 캡처의 모든 것입니다! 읭? 뭐 당연한거 아냐? 라고 생각이 들 수도 있어요. 

> 클로저에 대한 설명인데 왜 중첩함수가 나오냐고 의문이 드실 수 있습니다. 중첩함수는 클로저의 형태중 하나이기 때문에 중첩함수도 클로저 입니다!. 
<[**참고**](https://sweetfood-dev.github.io/swift/Closure/)>

위의 코드를 마저 작성해봅시다

```swift
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let tenIncrementer = makeIncrementer(forIncrement: 10)
print(tenIncrementer()) // 10
print(tenIncrementer()) // 20
print(tenIncrementer()) // 30
```

출력은 잘되는데 뭔가 이상하지 않나요?.

makeIncrementer 함수의 경우 모든 임무를 완료하고 중첩 함수인 incrementer를 반환 하고 사라지겠죠?

사라진다는 건 메모리에서 내려간다는 뜻이겠죠? 그럼 amount와 runningTotal도 사라져야 맞는거 아닐까요?

그런데 내부에서 없어져야할 amount와 runningTotal을 사용하고 있는 tenIncrementer는 잘 동작하죠.

이런걸 설명할 수 있는 힌트가 위에 나와있습니다. 바로 **참조**라는 마법의 단어에요. 이해를 하기 위해 간단하게 참조 타입에 대해 알아봅시다.

## 참조 타입 그리고 값 타입

> 살짝만 알아보고 더 구체적인건 추후 class와 struct에 대해 설명할 때 구체적으로 알아보아요!

Swift에서의 모든 타입들은 크게 참조 타입(Reference Type)과 값 타입(Value Type)으로 구분 되어집니다.

참조타입은 C언어에서의 포인터이고 값 타입은 그냥 일반 Int, String같은 기본 자료형이라고 생각하면 되요. 

포인터는 값이 들어있는 변수의 주소를 가리키잖아요? 그래서 참조 타입은 값을 전달할 때 해당 **값의 메모리 위치**를 전달합니다.

그렇다면 값 타입은? 값 자체를 **복사**해서 전달하게 됩니다.

## 클로저의 캡처

참조 타입까지 알아봤으니 이제 클로저의 정의에 대해 다시 곰곰히 생각해 봅시다

> 정의된 컨텍스트에서 상수와 변수에 대한 참조를 "캡처"하고 저장할 수 있다.

참조를 캡처한다고 하였으니 클로저를 사용하면 변수 / 상수의 메모리 위치를 사용하는 거겠죠?

어 근데 분명 기본 자료형은 값 타입이라고 했는데..? 사실 그게 저도 확실치는 않습니다만

( 확실히 아시는 분은 답글 부탁드려요 ㅠㅠ) 

클로저의 캡처에 의해 예외적으로 참조 타입으로 되는 것 같습니다!

참조 타입으로 변한다는걸 간략하게 알 수 있는 예제 코드를 준비해봤습니다

```swift
var a = 0
var b = 0

// 클로저 
let foo = { print("a \(a) b \(b)") }

a = 10 
b = 20

foo()
// a 10 b 20 출력
```

0으로 초기화한 변수 a,b가 있고 이 변수들을 출력하는 클로저를 담은 상수 foo가 있습니다.

foo를 실행 시켰을 때 값 타입으로 동작한다면 이 시점에서 a,b는 0이니까 0이 출력되어야 하는데 

각각 10과 20이 출력됩니다. 참조 타입으로 동작한다는걸 확인할 수 있는 셈이죠!!

이렇다 하더라도 makeIncrementer함수가 종료되면 인수 amount나 변수 runninTotal도 메모리에서 내려가야하니 참조자체가 안되야 하는거 아닐까요? 이 의문을 해결하려면 Swift의 메모리 관리를 조금은 알아야 합니다.

나중에 더 자세하게 알아볼 기회가 있을테니 이번에는 개념정도만 알고 갑시다!.

Swift는 Arc라는 걸 사용하여 메모리관리를 합니다. 이게 뭐냐? **값 타입이 아닌 참조 타입**에 한하여  참조되는 횟수를 카운트하여 0이되면 메모리에서 해지하는 거죠. 

그럼 슬슬 의문이 풀립니다 캡처는 변수, 상수를 참조합니다. 그러면 카운트가 1이 올라가겠죠?

그럼 Swift는 이놈들이 어디선가 참조되어 있음을 알기에 메모리에서 해제되지 않습니다.

> 참조가 되어 있다 == 어디선가 이놈을 사용하고 있다. 그러니 넌 살려주마!!!

그래서 계속 사용할 수 있는 것이죠.

## 정리

생각보다 너무 길어졌네요. 정리를 해봅시다!

1. 캡처링이란 클로저 자신이 정의된 곳의 주변 컨텍스트의 상수, 변수를 참조하는 것이다!
2. 캡처링이 된 상수와 변수는 참조 타입으로 동작한다!( 무조건인지 확실치는 않음 ㅠㅠ )
3. 참조 타입으로 동작하면 참조횟수가 1 더해져 ARC에 의해 메모리에서 해제 되지 않는다
4. 그리하여 클로저에서 캡처된 상수와 변수는 클로저가 없어지기 전까지 계속 사용할 수 있다!!
