---
title: "[Swift] Type & Mutation - 1"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Type
- Class
- Struct
toc: true
toc_sticky: true
toc_label: 목차
---

타입이란?

수행할 수 있는 일련의 **작업**과, **데이터**를 **그룹화** 한 것

Swift는 표준 타입과 사용자 정의 타입을 사용하여 프로그램을 빌드한다

Swift의 Type 시스템은 안전하고 효율적인 코드의 핵심이다

> 일반적으로 작업은 아마 함수 / 메서드, 데이터는 프로퍼티를 말하는 것 같음
> 

## 기본 타입 (The fundamental types)

Swift의 Type 시스템은 소수의 기본 타입으로 구성됨

기본 타입에는 `Named types`으로 불리는 `프로토콜`, `열거`, `구조체`, `클래스`와

`Compound types`인 `함수`, `튜플`이 포함된다

각 타입은 특정상황에서 유용하게 사용할 수 있는 유니크한 **프로퍼티 집합**이 있다.

## 타입을 사용한 모델링 (Modeling with types)

```swift
struct StructPoint {
	var x, y: Double
}

class ClassPoint {
	var x, y: Double
	init(x: Double, y: Double) { (self.x, self.y) = (x, y) }
}
```

위 두 타입은 모두 `x`,`y` 평면의 한점을 모델링한 사용자 정의 타입이다.

하나는 **구조체**, 다른 하나는 **클래스** 타입으로 **5가지의 본질적인 차이점**이 있다.

### 차이점1 - 자동 초기화

클래스 타입은 이니셜라이저가 필수로 선언되야함

반면 구조체 타입은 이니셜라이저가 없다면 컴파일러가 **멤버와이즈 이니셜라이저**를 생성하여 제공함

> 구조체에 이니셜라이저를 정의하면 컴파일러가 멤버와이즈 이니셜라이저를 생성하지 않는다
컴파일러가 생성해주는 멤버와이즈 이니셜라이저와 사용자 정의 이니셜라이저를 모두 사용하고 싶다면
트릭이지만 구조체를 extension 하여 사용자 정의 이니셜라이저를 생성하면 모두 사용이 가능하다
> 

### 차이점2 - Copy Semantics

구조체는 값 semantic, 클래스는 참조 semantic이다

값 semantic은 복사, 독립적이다

참조 semantic은 동일한 메모리를 참조하기 때문에 공유적인 성격이 있다.

```swift
let structPointA = StructPoint(x: 0, y: 0)
var structPointB = structPointA
structPointB.x += 10
print(structPointA.x)
// 0

let classPointA = ClassPoint(x: 0, y: 0)
let classPointB = classPointA
classPointB.x += 10
print(classPointA.x)
// 10
```

값 타입의 구조체는 복사가 일어나기 때문에

`structPointB.x += 10`이 실행되어도 `structPointB`의 `x`값이 바뀌지 

`structPointA`의 `x`값이 바뀌지 않는다.

반면 참조 타입인 클래스는 메모리를 참조하기 때문에 `classPointA.x`값도 10이 출력되는걸 볼 수 있다.

### 차이점3 - Mutation의 범위 (Scope of Mutation)

Swift는 **인스턴스 수준**의 mutation 모델을 지원한다

> objectiv-c는 타입 수준의 mutation 모델을 지원한다고함
NSString은 변경이 안되지만, NSMutableString은 변경이 가능한 것이 그 예이다.
> 

이는 `var`대신 `let`을 사용하여 `mutation`으로 부터 인스턴스를 잠글 수 있음을 의미함

다만 **참조 타입인 클래스**는 `let`이어도 `x` 값을 바꿀 수 있다

클래스 타입에서 mutation 제어는 기본 프로퍼티 데이터가 아닌 **참조**에 적용되기 때문이다

즉, 참조타입에서 `let`은 **가리키는 메모리 위치가 바뀔수 없음을 의미**한다

### 차이점4 - Heap vs Stack

일반적으로 클래스는 힙 메모리, 구조체와 열거형은 스택 메모리를 사용함

스택 할당은 힙 할당보다 빠르기 때문에 값 타입이 빠르다라고 보편적으로 생각하고

이는 값 타입이 이점으로 가지는 점이다

그렇다면 근본적으로 이런 속도의 차이는 왜 발생하는 것일까?

**각 실행 쓰레드는 자체적으로 스택을 가지고 있으며,** 

스택은 최상단 요소를 수정할 때만 변경이 된다. 따라서 스택에 할당과 할당해제를 하는데 있어 비용이 큰 concurrency 잠금이나 고급 할당 전략이 필요하지 않다

스택에서 할당과 할당해제는 단일 클록틱에서 더하기, 빼기명령으로 수행이 가능하다

반면 힙**은 여러 쓰레드에서 공유되는 영역**이기 때문에 concurrency 잠금으로 보호되어야 한다.

OS는 다른 크기의 메모리 블록을 할당 / 할당해제 시 발생할 수 있는 "**힙 조각화**"로부터 보호해야하기 떄문에

할당과 할당해제에 비용이 많이 들어가게 된다

![차이점4힙vs스택.png](/assets/images/Posts/Swift/2021-10-03/heap_vs_stack)

위 그림을 보면 구조체 `structPointB`, `structPointA`는 모두 **스택에 배치**되어 있고

클래스 `classPointB`, `classPointA`는 **스택(메모리 위치)과 힙 영역(내부 데이터) 모두에 배치**되어 있다

**참조 타입은 공유되기 때문에 힙의 refCount를 통해 객체의 수명을 추적하는데 사용**한다.

refCount가 0으로 내려갈때 `deinit`이 호출되고 할당이 해제된다

### 차이점5 - Lifetime and Identity

값 타입은 일반적으로 스택에 상주하며 복사 비용이 저렴하다.

"값"에는 lifetime과 id 개념이 없다.

반면 참조는 lifetime이 있어( refCount로 수명을 추적) deinit 함수를 정의할 수 있다

또한 메모리의 특정위치에 있기 때문에 이를 식별할 수 있는 ID를 자동으로 가지게 된다

### 더 많은 차이점

상속을 포함하여 보다 많은 차이점이 존재함

앞으로 다른 주제에서 기회가 된다면 언급하도록 하겠음

## 새로 알게 된점
Swift는 인스턴스 수준의 mutation 모델 Ojb-c는 타입 수준의 mutation 모델 
각 실행쓰레드 마다 **스택**을 가지고 있다
클래스는 스택과 힙 모두에 배치된다. 스택에는 힙의 위치가, 힙에는 내부 데이터가 위치한다


