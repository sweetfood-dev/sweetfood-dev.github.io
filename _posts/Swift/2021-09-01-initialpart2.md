---
title: "[Swift] 초기화 구문 Part2 (initializer)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Initializer
toc: true
toc_sticky: true
toc_label: 목차
---

[애플 가이드북](https://docs.swift.org/swift-book/LanguageGuide/Initialization.html)을 보고 저 나름대로 이해한 대로 풀어보겠습니다.

이 포스트가 처음이신 분들은 이전 내용들을 먼저 훑어 보고 오시는걸 추천합니다!

1. [초기화구문1](https://sweetfood-dev.github.io/swift/initializer/)
2. [2 단계 초기화](https://sweetfood-dev.github.io/swift/2phaseinit/)

## 상속과 재정의

기본적으로 Swift에서는 상위 클래스의 이니셜라이저를 서브 클래스에 상속시키지 않습니다.

그 이유는 하위클래스에서 잘못 초기화되는 것을 방지하기 위해서라고 합니다.

### 이니셜라이저 재정의

재정의를 먼저 알아 봅시다. 

상속 받은 연산 프로퍼티, 메소드와 같이 이니셜라이저도 재정의가 가능합니다.

```swift
class Parent {
    var age = 50
}

class Child: Parent {
    override init() {
        super.init()
        age = 20
    }
}

let me = Child()
print(me.age) // 20
```

먼저 Parent는 age라는 Int 타입의 저장 프로퍼티를 가지고 있습니다.

선언과 동시에 50으로 초기값을 할당해 주었습니다.

이렇게 모든 저장 프로퍼티에 초기값을 할당해 주면 자동적으로 init() 이니셜라이저를 생성해준다는 점!

그리고 Child라는 Parent클래스를 상속받는 서브 클래스를 선언해 주었습니다.

init() 앞에 override 키워드를 붙여주어 재정의 한 거 보이시나요?

그리고 구현에 있어서 **초기화시 저장 프로퍼티에 값을 할당하기 위해서는 모든 프로퍼티가 초기화 되어 있어야** 하기 때문에 super.init()을 통해 부모의 저장 프로퍼티를 초기화 시켜주고 age에 할당을 시켜 주었죠.

> 왜 그래야 하는지 이해가 안된다면 이전 포스트인 2단계 초기화를 참고해주세요!

## 이니셜라이저 자동 상속

이건 뭐야? Swift는 분명 서브 클래스가 잘못 초기화 되는걸 방지하기 위해 상위 클래스의 이니셜라이저는 상속하지 않는다며?

네 맞습니다. 

단, 하위클래스에서 새롭게 사용하는 **저장 프로퍼티에 기본값을 제공한다는 가정**하에 **두 가지 조건을 만족**하면

자동으로 이니셜라이저를 상속 받습니다

1. 하위 클래스에서 **지정 이니셜라이저를 정의하지 않는다면** 자동으로 상위클래스의 지정 이니셜라이저를 상속 받는다.
2. 서브 클래스가 상위클래스의 모든 **지정 이니셜라이저를 자동 상속** 받거나( 규칙 1에 의한 자동 상속)
상위 클래스의 모든 **지정 이니셜라이저를 서브 클래스에서 구현(override)**한다면 
상위 클래스의 모든 **편의 이니셜라이저를 상속** 받는다
(**상위 클래스의 지정 이니셜라이저를 서브 클래스에서 편의 이니셜라이저**로 override한 것도 포함)

하아. 말 참 어렵습니다.

우리모두 친숙한 코드로 살펴 봅시다

```swift
class Food {
    var name: String
    init(name: String) {
        self.name = name
    }
    convenience init() {
        self.init(name:"[Unnamed]")
    }
}
```

Food라는 클래스는 name이라는 저장 프로퍼티와 이 저장 프로퍼티에 기본 값을 제공하는 

**지정 이니셜라이저 init(name:)**과 편의 **이니셜라이저 init()**을 가지고 있습니다.

```swift
class Recipe: Food {
    var count: Int
    init(name: String, count: Int) {
        self.count = count
        super.init(name: name)
    }
	
    override convenience init(name: String) {
        self.init(name: name, count: 1)		
    }
}
```

Recipe는 Food를 상위 클래스로 하는 서브 클래스입니다.

count라는 저장 프로퍼티를 추가하였고 **init(name: count:) 지정 이니셜라이저**를 가지고 있습니다

자체 저장 프로퍼티 count에 기본 값을 주고 상위 클래스의 지정 이니셜라이저를 호출하고 있네요.

편의 이니셜라이저를 봐볼까요? 어디서 본거 같지 않나요? 네 맞습니다 init(name:)은 상위 클래스 Food의 
지정 이니셜라이저입니다.

그걸 override하여 편의 이니셜라이저로 재정의 하였습니다. 

이쯤에서 자동 상속의 조건을 다시 봐봅시다.

**기본 조건** : 서브 클래스에서 새롭게 사용하는 저장 프로퍼티에 기본값을 제공 ( 지정 이니셜라이저를 통하여 )

**조건 1**: 하위 클래스에서 지정 이니셜라이저를 정의하지 않으면 상위 클래스의 지정 이니셜라이저를 상속
→ 해당 없음

**조건 2**:  상위 클래스의 모든 지정 이니셜라이저 init(name:) 을 구현하면 상위 클래스의 편의 이니셜라이저를
자동 상속 받는다

기본 조건을 만족하고 조건 1은 만족하지 못하지만 조건2는 만족하죠 그렇다면 우리는 Food의 편의 이니셜라이저

init()을 자동으로 상속 받을 수 있습니다!

봐볼까요?

```swift
let a = Recipe()
let b = Recipe(name: "union")
let c = Recipe(name: "meet", count: 5)
```

자동 상속을 받아 Recipe()를 사용한 인스턴스 생성이 가능합니다.

여기서 Food의 편의 이니셜라이저인 init()은 내부에서 self.init(name:) 이니셜라이저를 호출하는데

저 이니셜라이저를 우린 Recipe에서 편의 이니셜라이저로 재정의하였죠?

그래서 실제 호출되는 건 Food의 지정 이니셜라이저 init(name:)이 아닌 Recipe의 편의 이니셜라이저
init(name:)이 호출됩니다!

![initial3.png](/assets/images/Posts/Swift/2021-09-01-initializer/initial3.png)

> quantity라고 되어 있는 파라미터를 저는 count로 사용하였습니다 ㅎㅎ

그림으로 보면 자동 상속된 init()에서 부터 출발하여 편의 이니셜라이저 init(name)
지정 이니셜라이저 init(name, count)가 호출되고 상위 클래스의 지정 이니셜라이저 init(name)이
호출되는 걸 볼 수 있습니다.

자동 상속 받은 편의 이니셜라이저에서 호출하는 지정 이니셜라이저는 서브 클래스의 지정 이니셜라이저라는 점!

그럼 지정 이니셜라이저를 정의하지 않는 조건1의 경우는 어떤게 있을까요?

```swift
class Shopping: Recipe {
    var purchase = false
}
```

Recipe를 상속 받고 자신이 새로 사용하는 purchase 저장 프로퍼티를 선언과 동시에 기본값을 부여해주었습니다.

지정 이니셜라이저는 정의하지 않았습니다. 그럼 조건1을 만족하니 지정 이니셜라이저를 모두 상속 받겠죠?

근데 과연 지정 이니셜라이저만 상속 받을까요?

조건 2를 다시 살펴 보시죠.

보셨나요? 네 모든 지정 이니셜라이저를 상속 받거나 구현 하는 경우 편의 이니셜라이저도 자동 상속을 받는게

조건2였죠?

이 경우 조건1을 만족하였기 때문에 편의 이니셜 또한 모두 상속 받게 됩니다.

init()

init(name)

init(name, count)

3가지의 이니셜라이저를 모두 상속 받을 수 있다는 거죠!

```swift
let a = Shopping()
let b = Shopping(name:"union")
let c = Shopping(name:"meet", count: 10)
```

이렇게요! 그림으로 봐봅시다

![initial4.png](/assets/images/Posts/Swift/2021-09-01-initializer/initial4.png)

자동으로 모든 이니셜라이저를 상속 받았다는게 한눈에 보이죠?

## 정리

1. 이니셜라이저를 재정의할 수 있다
2. 서브 클래스에서 추가된 프로퍼티가 기본값을 제공받는 조건을 가정하고
3. 서브 클래스가 지정 이니셜라이저를 정의하지 않는 경우엔 모든 상위 지정 이니셜라이저를 상속 받는다
4. 서브 클래스가 상위 클래스의 모든 지정 이니셜라이저를 상속 받거나 
모든 지정 이니셜라이저를 재정의 한다면
상위 클래스의 모든 편의 이니셜라이저를 자동 상속 받는다
