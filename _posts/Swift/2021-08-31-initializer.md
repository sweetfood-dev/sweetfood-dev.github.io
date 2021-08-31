---
title: "[Swift] 초기화(Initializer)"
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

Swift는 인스턴스로 생성 되기 전 까지 저장 프로퍼티가 초기값을 가져야만 하는 제약조건이 있습니다.

초기값을 부여하는 방법에는 기본값을 부여하거나 **특별한 메소드** 안에서 초기값을 설정하는 방법이 있는데

이 때 특별한 메소드를 이니셜라이저라고 합니다. 

기본값은 저장 프로퍼티 정의와 함께 값을 지정하면 되겠죠?

```swift
struct SomeStruct {
    var name = "sweetfood"
}
```

그렇다면 이니셜 라이저는 어떻게 선언할까요?

```swift
struct SomeStruct {
    var name: String
    init() {
        name = "sweetfood"
    }
}
```

특별한 메소드인 만큼 func를 생략하고 사용할 수 있습니다.

그리고 메소드이니까 당연하게 인자레이블과 파라미터를 줄 수도 있답니다. 이를 **사용자 정의 이니셜라이저**라고 합니다.

```swift
struct SomeStruct {
    var name: String
    init(setProperty name:String) {
        self.name = name
    }
}

let some = SomeStruct(setProperty: "sweetfood")
```

보통의 경우 사용자 정의 이니셜라이저를 많이 사용하고 쉽게 볼 수 있습니다.

기본적인 이니셜라이저를 알아 봤으니 좀 더 세부적으로 들어가봅시다!

## 기본 이니셜라이저

클래스나 구조체의 모든 프로퍼티가 기본값을 가지고 있는 상태에서

init()을 정의 하지 않았다면 Swift는 기본 이니셜라이저를 제공합니다.

이 기본 이니셜라이저는 모든 저장프로퍼티가 기본값을 가진 인스턴스를 생성합니다.

```swift
class SomeClass {
    var name = "SweetFood"
}

let mClass = SomeClass()
mClass.name // "SweetFood"
```

init()을 구현하지 않았음에도 성공적으로 인스턴스를 생성할 수 있고 name 프로퍼티는 기본값 SweetFood를 가지고 있는걸 확인 할 수 있습니다.

### Memberwise

구조체 타입은 특별한 기본 이니셜라이저를 가지고 있습니다.

init()을 정의하지 않은 경우 구조체가 가지고 있는 저장 프로퍼티명들을 인자로 받는 기본 이니셜라이저를

제공해주는데 이를 **멤버와이즈 이니셜라이저**라고 합니다

```swift
struct Person {
    var firstName
    var lastName
}

let sweetfood = Person(firstName: "sweet", lastName: "dev")
```

위 처럼 사용자 정의 이니셜라이저를 정의하지 않았음에도 Swift가 해당 이니셜라이저를 자동으로 제공해줍니다

## 이니셜라이저 위임

뭔가 그럴듯한 이름인데 별 것 없습니다. 

사용자 정의 이니셜라이저는 여러개가 존재할 수 있어요

A이니셜라이저 안에서 B이니셜라이저를 호출할 수가 있는데 이를 이니셜라이저 위임이라고 부른다네요

다만, 다른 이니셜라이저를 호출할 때 당연하겠지만 규칙이 존재하는데 이 규칙은 구조체와 클래스에 따라 다르게 적용이 됩니다.

값 타입인 구조체의 경우 상속을 할 수 없기 때문에 자신이 제공하는 이니셜라이저만 호출할 수 있지만

클래스인 경우, 상속이란걸 할 수 있는데 상속을 하게 되면 부모 클래스의 저장 프로퍼티 까지 초기화를 해야하는 **의무**가 주어진답니다. 그래서 구조체 보다 규칙이 좀 빡셉니다 그렇다고 막 복잡하고 그런건 아니지만요 

따라서 구조체와 클래스를 나누어서 알아 보도록 할게요

### 구조체의 이니셜라이저 위임

구조체는 뭐 간단해요 그냥 self.init으로 다른 이니셜라이저를 호출할 수 있어요.

```swift
struct SomeStruct {
    var firstName: String
    var lastName: String
    var description: String { "\(firstName) \(lastName)" }

    init(firstName: String, lastName: String) {
        self.firstName = firstName
        self.lastName = lastName
    }
    init(firstName: String) {
        self.init(firstName: firstName, lastName: "sweetFood")
    }
}

let some = SomeStruct(firstName:"dev")
some.description // " dev sweetFood"

let some2 = SomeStruct(firstName:"sweetfood", lastName:"dev")
some2.description // "sweetfood dev"
```

init(firstName:) 에서 init(firstName:,lastName:)을 호출하는걸 볼 수 있죠?

아 여담으로 이렇게 사용자 정의 이니셜라이저를 정의하면 위에서 언급한 기본 이니셜라이저와 멤버와이즈 이니셜라이저는 제공되지 않으니 유의해주세요!

> 만약 사용하고 싶다면 extension에서 이니셜라이저를 정의하면 사용할 수 있습니다!

### 클래스의 이니셜라이저 위임

클래스는 상속이 가능하다 하였죠?

그럼 상속하는 클래스에도 아마 저장 프로퍼티들이 있을거에요.

상속받은 저장 프로퍼티와 자신의 저장 프로퍼티 모두 초기값을 할당해야 하는게 바로 자식의 **의무**입니다.

그럼 막 초기화 해야할 프로퍼티가 엄청 많아지겠죠? 이니셜라이저의 이름이 엄청 길어질 수도 있을거에요.

이를 위해 Swift는 클래스에 대해 2가지의 이니셜라이저를 제공하는데 바로 **지정 이니셜라이저**, **편의 이니셜라이저** 입니다.

**지정 이니셜라이저**는 클래스의 주(Primary) 이니셜라이저로 모든 프로퍼티를 초기화 하는 곳입니다.

클래스에는 이 지정 이니셜라이저가 **최소 1개는 존재**해야 합니다.

**편의 이니셜라이저**는 보조의 역할과 비슷한데요. 최소의 입력으로 초기화 할 수 있도록 해주는 도우미같은 녀석이에요. 있어도 되고 없어도 되는 이니셜라이저 입니다.

문법도 함께 알아 봅시다.

```swift
// 지정 이니셜라이저
init(파라미터_생략가능) { }
// 편의 이니셜라이저
convenience init(파라미터_생략가능) { }
```

지정 이니셜라이저는 일반 이니셜라이저의 정의와 같고 편의 이니셜라이저는 convenience 키워드를 붙여 주기만 하면 된답니다. 

근데 이 이니셜라이저들을 호출(우리는 이걸 위임이라 했죠? )할 때는 지켜줘야 하는 규칙이 있어요

1. 지정 이니셜라이저는 직계 super 클래스의 지정 이니셜라이저를 호출해야 한다
2. 편의 이니셜라이저는 자신의 다른 이니셜라이저만 호출할 수 있다
3. 궁극적으로 편의이니셜라이저는 지정 이니셜라이저를 호출 해야 한다

부모 클래스가 있다면 부모 클래스의 저장 프로퍼티도 초기화 해야 하는 의무가 있다고 하였죠?

그 의무를 우린 **부모 클래스의 이니셜라이저를 통해 할 수 있는데 이 호출을** **지정 이니셜라이저**에서만 해야해요

편의 이니셜라이저에서는 할 수 없습니다.

왜냐? 2번 규칙에 나와 있듯이 **편의 이니셜라이저는 부모가 아닌 자신의 이니셜라이저만 호출** 할 수 있거든요.

그러면 편의 이니셜라이저는 자신의 편의 이니셜라이저와 지정 이니셜라이저를 호출 할 수 있겠죠?

하지만 결국은 **필수적으로 지정 이니셜라이저가 호출되야만 한다**는게 바로 3번 규칙입니다.

네 혼잡합니다. 설명이 아주 까다로워요. 그래서 우리의 애플님들은 친절하게도 그림을 통해 이해시켜 주십니다.

![initialier1.png](/assets/images/Posts/Swift/2021-08-31-initializer/initialier1.png)

Designated가 지정 이니셜라이저고 Convenience가 편의 이니셜라이저에요.

SuperClass를 보면 편의 이니셜라이저가 편의 이니셜라이저를 호출하고 결국엔 지정 이니셜라이저를 호출하네요. 이건 결국에는 지정 이니셜라이저를 호출해야 한다는 **규칙3번**입니다.

Subclass를 봐볼까요? 지정 이니셜라이저 2개가 있는데 모두 부모의 지정 이니셜라이저를 호출하고 있습니다. **규칙1번**이죠.

1개의 편의 이니셜라이저는 자신의 지정 이니셜라이저를 호출하고 있네요. **네 규칙2번**입니다. 

어때요? 그림으로 보니 좀 더 이해가 수월한가요?

초기화 구문을 이번 포스트에서 모두 정리하려 하였는데 생각보다 양이 방대하네요 ㅠㅠ

다음 포스트에서 이어나가겠습니다!
