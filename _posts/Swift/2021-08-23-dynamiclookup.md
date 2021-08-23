---
title: "[Swift] Dynamic member lookup"
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
toc: true
toc_sticky: true
toc_label: 목차
---
# Dynamic member lookup

Dynamic 동적

member 멤버, 회원

lookup 찾다, 조회

동적 멤버 조회? 난해한 이름이네요.

먼저 이 녀석을 사용하였을 때 우리는 **첨자 대신 도트 구문을 제공** 받을 수 있습니다.

뭔가 싶죠? 자 차근차근 잘게잘게 씹어 먹어 봅시다!

이 동적 멤버 조회라는 난해한 이름을 가진 녀석을 이해하기 위해서 지난 포스트에서 알아본

subscript를 다시 떠올려봐야 하는데요

subscript는 첨자를 사용해 인스턴스의 프로퍼티에 접근할 수 있는 도우미였죠

```swift
struct Person {
	var name: String
	var age: Int

	subscript(key: String) -> String {
		switch key {
		case "info":
			return "\(name) : \(age)"
		default: 
			return "nothing"	
		}
	}
}

var p = Person(name: "sweet", age: 17)
p["info"] // sweet : 17
p["asjdlkjasldf"] // nothing
```

요놈 처럼요.

동적 멤버 조회도 비슷한 맥락입니다.

다만 "첨자" 대신 도트(.)를 사용하여 접근하는거죠

```swift
// subscript 사용
p["info"] // sweet : 17
//동적 멤버 조회 사용
p.info // sweet : 17 
```

뭔가 더 우리에게 익숙하고 편할거 같은 느낌적인 느낌?

## 선언 및 사용

이 동적 멤버 조회를 사용하기 위해선 컴파일러에게  **@dynamicMemberLookup** 키워드로 미리 알려줘야합니다

```swift
@dynamicMemberLookup
struct Person {
    var name: String
    var age: Int

    subscript(key: String) -> String {
        switch key {
        case "info":
            return "\(name) : \(age)"
        default: 
            return "nothing"	
        }
    }
}
```

하지만 우리는 오류를 맞이 할꺼에요...

> @dynamicMemberLookup attribute requires 'Person' to have a 'subscript(dynamicMember:)' method that accepts either 'ExpressibleByStringLiteral' or a key path

dynamicMemberLookup을 사용하기 위해선 **subscript(dynamicMember:**)를 구현해야 한다고 하네요.

가뿐하게 구현해 줍시다

```swift
@dynamicMemberLookup
struct Person {
    var name: String
    var age: Int

    subscript(key: String) -> String {
        switch key {
        case "info":
            return "\(name) : \(age)"
        default: 
            return "nothing"	
        }
    }

    subscript(dynamicMember key: String) -> String {
        switch key {
        case "member":
            return "\(name) : \(age)"
        default: 
            return "nothing"	
        }
    }
}

var p = Person(name:"Sweet", age:17)
p["info"]
p.member
```

짜잔! 이게 동적 멤버 조회입니다.

이제 **첨자 대신 도트 구문을 제공** 받을 수 있다란 말이 이해가 갑니다!!

구조체 Person의 프로퍼티는 name,age 밖에 없지만 subscript를 추가하여 member를 마치 프로퍼티 처럼 사용할 수 있죠.

사실 아직 저한테 많이 와닿는 문법은 아니에요. 저렇게 많은 코드를 추가하여 얻을 수 있는 결과가 연산 프로퍼티의 결과와 같은거 같다란 말이죠..?

뭐 필요하고 유용하니까 애플의 개발자들이 제공해주시는 거겠죠?

## 주의

이 동적 멤버 조회는 런타임 단계에서 동적으로 호출 된다고 하네요.

> 그래서 이름에 dynamic이 붙은거 같아요?

그래서 컴파일 레벨에서의 safty를 포기할 수 밖에 없습니다 ㅠ

```swift
var p = Person(name:"Sweet", age:17)
p["info"]
p.member
p.ajskldja
p.nonononono
```

밑에 저 외계어 같은 구문도 컴파일단계에서 걸러주지 못한다는 것이죠.

하지만 추후 학습할 **keyPath**를 사용하여 이런 단점을 커버할 수 있습니다!!

subscript(dynamicMember:)에서 매개변수로 사용할 수 있는 타입이 정해져 있습니다.

**keyPath**와 [**ExpressibleByStringLiteral**](https://developer.apple.com/documentation/swift/expressiblebystringliteral) 프로토콜입니다.

읭? 그럼 저기서 사용한 String은? 하실 수 있겠지만

String 타입이 바로 ExpressibleByStringLiteral 프로토콜을 채택하였기 때문에 사용할 수 있습니다.

## 정리

1. 동적 멤버 조회는 첨자 구문을 도트(.)구문으로 사용할 수 있게 해준다!
2. 사용할 때는 미리 컴파일러에게 @dynamicMemberLookup 키워드를 사용해 알려주자
3. subscript(dynamicMember 인자명:타입) → 반환타입 으로 구현한다
4. 인자에 사용할 타입은 keyPath, ExpressibleByStringLiteral 타입만 가능하다
