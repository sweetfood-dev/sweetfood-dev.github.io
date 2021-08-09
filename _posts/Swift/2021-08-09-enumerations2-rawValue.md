---
title: "[Swift] 원시값 (Raw Values)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
toc: true
toc_sticky: true
toc_label: 목차
---

## 원시값?

모든 case가 **같은 타입**의 **기본값**을 가질 수 있는데 이 기본값을 원시값이라고 합니다.

각 case마다 원시값은 **고유**해야합니다.

```swift
Enum Food: Int {
    case candy = 1
    case icecream = 2
    case noodle = 3
}
```

Food에 Int 타입을 선언해주면 이 Food의 각 case들은 모두 Int 타입의 기본 값을 가질 수 있습니다.

어떤건 String, 어떤건 Double 이런 식은 안되고 모두 Int라는 같은 타입의 원시값을 가질 수 있습니다.

그리고 이 원시값은 위의 예처럼 "고유" 해야한답니다!

## 암시적 원시값

위의 예제에서는 각 case마다 원시값을 명시적으로 지정해 주었지만 암시적으로도 사용할 수 있습니다.

> 정수 타입과 문자열 타입에 한해 암시적 원시값을 제공하는 것 같습니다!

### 정수 타입의 암시적 원시값

```swift
// 모든 case 암시적
Enum Level: Int {
    case low 
    case middle
    case high
}
// 암시적 원시값으로 인해 low = 0 , middle = 1 , high = 2

// 부분 암시적1
Enum Level: Int {
    case low = 3
    case middle
    case high
}
// 암시적 원시값으로 인해 low = 3 , middle = 4 , high = 5

// 부분 암시적1
Enum Level: Int {
    case low 
    case middle
    case high = 3
    case veryhigh
}
// 암시적 원시값으로 인해 low = 0 , middle = 1 , high = 3, veryhigh = 4
```

기본적으로 Int 타입의 암시적 원시값은 첫 케이스부터 0을 부여하고 1씩 증가 하는 것 같습니다.

### 문자열 타입의 암시적 원시값

String 타입일 경우 case의 이름이 원시값이 됩니다

```swift
enum Food {
    case candy
    case icecream = "Merona"
    case cake
}
// 암시적 원시값으로 인해 candy = "candy", icecream = "Merona", cake = "cake"

```

## 원시값으로 초기화

원시 값을 사용해 열거형을 초기화할 수 있습니다! 단, 이때 반환되는 열거형 값은 옵셔널 값입니다!

> 열거형에 정의되 있지 않은 원시값으로 초기화를 할 수 있기 때문이죠! 이때는 nil이 반환됩니다

```swift
enum Food: String {
    case candy
    case icecream
    case cake
}

let favorite = Food(rawValue: "cake")

if let favorite = favorite { // 옵셔널이기 때문에 옵셔널 바인딩!
    switch favorite {
    case .candy:
        print("candy")
    case .icecream:
        print("icecream")
    case .cake:
        print("cake")
    }
}
```

## 연관값과 원시값

Raw값은 관계 값(associated value)과는 다릅니다. Raw값은 코드에서 열거형을 처음 선언할 때 정의되서 특정 열거형의 raw값은 항상 같은 값을 갖습니다. 하지만 관계 값은 같은 case라도 생성될 때 달라질 수 있습니다.

그리고.. 연관값과 원시값은 동시에 사용할 수 없더라구요?

```swift
enum Food: String {
    case candy
    case icecream
    case cake
    case etc(name: String) // 오류오류오류!!
}
```

왜냐면 원시값의 정의 때문인데요.

원시값은 특정 case의 값을 **고유하게** 식별하는 것입니다. 여기서 "**고유하게**"란 원래 값 대신 원시값을 사용하여

정보를 잃지 않겠다라는 의미라고 합니다.

[RawRepresentable 프로토콜에서 확인할 수 있습니다](https://developer.apple.com/documentation/swift/rawrepresentable)

보면 알겠지만 rawValue의 프로퍼티와 init?(rawValue:) 메소드는 모두 이 RawRepresentable 프로토콜에서 제공 해주고 있었습니다 ㅠ 

그렇다면 이건 포기해야할까? 

아니죠 꼼수가 있습니다! 바로 연산 프로퍼티!!!

```swift
enum Food {
    case candy
    case icecream
    case cake
    case etc(name: String)
    
    var name: String {
        switch self {
            case .candy : return "candy"
            case .icecream : return "icecream"
            case .cake : return "cake"
            case .etc : return "etc"
        }
    }
}

let favorite = Food.etc(name: "kimchi")

guard case let .etc(foodName) = favorite else {
    fatalError("Error")
}

print("type is \(favorite.name) and \(foodName)")
```

이렇게 연산 프로퍼티를 사용하면 두 마리의 토끼를 다잡을 수 있죠!

그리고 가독성면에서의 프로퍼티명도 .rawValue라는 애매한 표현보다 .name 처럼 명확해지는

장점도 있습니다!

## 정리

1. 원시값은 특정 case를 고유하게 식별할 수 있다
2. Int, String 타입에서 암시적 원시값을 사용할 수 있다
3. Int는 0부터 혹은 지정한 원시값에서 +1 씩 증가 
4. String은 case의 이름이 문자열로 사용된다
5. 원시 값과 연관 값을 동시에 사용하고 싶다면 연산프로퍼티를 사용하자!
