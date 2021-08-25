---
title: "[Swift] KeyPath Member Lookup"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Subscripts
- KeyPath
- Dynamic Member Lookup
toc: true
toc_sticky: true
toc_label: 목차
---
subscript 관련한 문법의 마지막 단계에 왔습니다.

이번 포스트의 이해를 위해선 아래에 대한 이해가 필요 합니다!

1. [Subscript](https://sweetfood-dev.github.io/swift/subscripts/)
2. [Dynamic Member Lookup](https://sweetfood-dev.github.io/swift/dynamiclookup/)
3. [KeyPath](https://sweetfood-dev.github.io/swift/keypath/)

미리 보고 오시는걸 추천할게요!

## 개요

이름에서 알 수 있겠지만 KeyPath를 사용하여 Dynamic Member Lookup을 구현하는거에요.

이걸 왜사용하냐?

클래스나 구조체에 인스턴스 프로퍼티가 있고 그 인스턴스 프로퍼티의 프로퍼티에 접근하기 위해선

보통 아래와 같이 접근을 했죠

```swift
struct InnerInstance {
    var innerName = "inner"
}

struct OutterInstance {
    var instanceProperty = InnerInstance()
    var outterName = "outter"
}

let outterInstance = OutterInstance()
// 일반
print(outterInstance.instanceProperty.innerName) // inner
// keyPath 사용
print(outterInstance[keyPath: \OutterInstance.instanceProperty.innerName]) // inner
```

일반적인 접근이나 keyPath를 사용한 접근이나 너무 길어요. 불편하죠. 

keyPath와 Dynamic member lookup을 함께 사용하면 아래와 같은 접근이 가능합니다

```swift
print(outterInstance.innerName) // inner
```

**인스턴스 프로퍼티를 생략**할 수 있죠.

물론 바로는 안되요. subscript를 구현해줘야 합니다.

## 사용법

기본 Dynamic Member Lookup을 사용할 때 우리는 어떤걸 구현해줬죠?

```swift
subscript(dynamicMember 매개변수명: String) -> 반환타입
```

기억나시나요?

> 이것저것 막 수정해봤는데 인자레이블은 꼭 **dynamicMember**로 해야되는거 같네요! 
인자레이블이 없어도 안되요!

keyPath를 사용한 동적 멤버 조회는 아래와 같은 subscript를 구현해줘야 합니다

```swift
subscript(dynamicMember 매개변수명: KeyPath<타입, path타입)> -> 반환타입
```

< >표현은 제네릭이라 불리는데 차후 포스트하겠습니다. 지금은 그냥 이런게 있다 하고 넘어가자구요?

우리가 keyPath를 생성할 때 아래와 같이 사용하였죠

```swift
let someKeyPath = \타입명.path(프로퍼티명)
```

그리고 컴파일단계에서 위의 구문을 KeyPath 인스턴스로 변환한다고 하였죠?

그래서 keyPath를 사용한 동적 멤버 조회 subscript는 **KeyPath를 인자로 받습니다.**

<> 안의 첫번째는 **타입명**을, 두번째는 **path의 타입**(프로퍼티의 타입)을 받습니다.

코드를 보면 보다 이해가 쉬우실 거에요

```swift

struct InnerInstance {
    var innerName = "inner"
}

@dynamicMemberLookup
struct OutterInstance {
    var instanceProperty = InnerInstance()
    var outterName = "outter"

    //1
    subscript(dynamicMember member: KeyPath<InnerInstance, String>) -> String {
        // 2 , 3
        instanceProperty[keyPath:member]
    }
}

let outterInstance = OutterInstance()
outterInstance.innerName // inner
```

짜잔!!!! 복잡할 수 있으니 순서대로 살펴보자구요.

1. subscript(dynamicMember: KeyPath)를 사용하고 
2. 그 안에서 인스턴스 프로퍼티인 instanceProperty의 [keyPath:] subscript로
3. 전달받은 keyPath인 member를 넘겨 주고 그 값을 반환합니다.

여러번 하다보시면 이해가 가실거에요!

추가로 keyPath를 사용한 동적 멤버 조회는 추가로 또 이점이 있어요

일반적인 멤버 조회는 

```swift
@dynamicMemberLookup
struct OutterInstance {
    var outterName = "outter"

    subscript(dynamicMember member: String) -> String {
        print("String subscript")
        return member == "name" ? outterName : "nil"
    }
}

let outterInstance = OutterInstance()
outterInstance.name // outter
outterInstance.asdasdjkl // nil
outterInstance.au8g9u  // nil
```

이렇게 아무렇게나 작성해도 컴파일은 일단 된단 말이죠. 일반적인 동적 멤버 조회는 런타임시에 평가 되어지기 때문입니다. 그래서 오타가 입력되어 잘못된 값이 출력 될 수도 있는등의 단점이 있습니다.

하지만 keyPath를 사용하는 동적 멤버 조회는 위의 코드를 실행 시

> Value of type 'OutterInstance' has no dynamic member 'asdjhklasd' using key path from root type 'InnerInstance'

이런 오류를 출력 시켜주죠. 짱짱!

## subscript 우선순위

근데 한가지 궁금하지 않나요?

subscript(dynamicMember: KeyPath) : keyPath 동적 멤버 조회

subscript(dynamicMember: String) : 일반 동적 멤버 조회

이 둘다 인자레이블이 dynamicMember로 같고 그 타입만 다릅니다. 

물론 인자레이블이 아닌 인자레이블의 타입으로 어떤 subscript를 사용할 지 구분한다고 했으니 이해는 가지만

만약 두개를 모두 구현해놓고 outterInstance.innerName을 호출하면 어떻게 될까요? 한 번 해봅시다

```swift
struct InnerInstance {
    var innerName = "inner"
}

@dynamicMemberLookup
struct OutterInstance {
    var instanceProperty = InnerInstance()
    var outterName = "outter"

    subscript(dynamicMember member: String) -> String {
        print("String subscript")
        switch member {
        case "innerName" :
            return instanceProperty.innerName
        case "name" :
            return outterName
        default:
            return "invalid"
        }
    }
    
    subscript(dynamicMember member: KeyPath<InnerInstance, String>) -> String {
        print("keyPath subscript")
        return instanceProperty[keyPath:member]
    }
}

let outterInstance = OutterInstance()
outterInstance.innerName 
outterInstance.name
outterInstance.asdjhklasd

/* 출력 순서
keyPath subscript
String subscript
String subscript
*/
```

일반 동적 멤버 조회 subscript(dynamicMember:String) 보다 

subscript(dynamicMember:KeyPath)가 우선되어지는 것을 볼 수 있습니다.

저는 개인적으로 궁금해서 모두 구현해보고 실행해봤는데요. Swift 가이드북을 꼼꼼히 읽어보니

2개를 모두 구현 시 keyPath를 인자로 받는 subscript를 사용한다고 나와 있네요.

무식하면 몸이 고생합니다.

## 정리

1. KeyPath와 동적 멤버 조회를 함께 사용하기 위해선 subscript(dynamicMember:KeyPath<타입명,프로퍼티 타입>)를 구현한다
2. dynamicMember:KeyPath, dynamicMember:String 모두 구현하면 KeyPath를 인자로 받는 subscript를 우선적으로 실행한다

오늘도 지식이 +1 되었습니다.
