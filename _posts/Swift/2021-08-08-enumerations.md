---
title: "[Swift] 열거형 (Enumerations)"
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

## 열거형이란?

코드내에서 타입의 안전을 보장하기 위해 관련 값 **그룹**에 대한 공통의 타입을 정의하는 것!입니다.

그룹에 대한 공통의 타입에 대해 예를 들어보자면 1년은 12달로 이루어져 있죠.

1월 2월 3월 ... 12월까지 

1월이든 2월이든 모두 **한 달**이라는 공통적인 속성이 있어요. 이를 그룹화하여 하나의 타입으로 정의하는게 바로 열거형입니다.

```swift
enum Month {
    case january
    case february
    case march
    case april
    case may
    case june
    case july
    case august
    case september
    case october
    case november
    case december
}
```

부연설명이 많았지만 다른 대부분의 언어에서 사용하고 있는 Enum이죠.

## 다른 언어와의 차이점

### case의 값

제가 다른 언어는 잘 몰라서 알고 있는 c언어와 obj-c와 비교해보면

이런 언어들은 보통 첫 case는 1로 시작하여 연속적인 정수형의 값으로 이루어지죠

하지만 Swift는 엄청 유연합니다. 따로 타입을 정해 주지 않으면 case 그 자체가 그냥 값이에요 

위 Month 열거형의 경우 january의 값은 1이아닌 그냥 january인거죠(String도 아니에요 그냥 january가 값 그 자체입니다.)

원하면 case에 타입을 지정해 줄 수 있습니다. 심지어 String도 가능해요

```swift
enum Month: Int {
    case january = 1
    case february
    case march
    case april
    case may
    case june
    case july
    case august
    case september
    case october
    case november
    case december
}

enum Month: String {
    case january = "1월"
    case february = "2월"
    case march = "3월"
    case april
    case may
    case june
    case july
    case august
    case september
    case october
    case november
    case december
}
```

> 이것저것 타이핑을 해보니까 .hashValue라는 프로퍼티가 있더라구요? 무슨 해쉬값이지.. 하고 궁금해서 검색해보니 Xcode6 ~ Xcode9 에서는 인덱스로 사용이 되었지만 Xcode10 이후부터는 인덱스와는 관련이 없다라고 되어있네요. 그럼 왜 아직까지 남아 있는거지.. 아시는분 계신가요? ㅠㅠ

### first-class

일급 객체? 일급 시민? 일급 클래스? 어떤 표현이 맞는지 모르겠네요 ㅠ

> 직역해서 일급 클래스로 하겠습니다!

무튼 중요한건 표현이 아니죠.  Swift의 열거형은 일급 클래스이기 때문에 

연산 프로퍼티, 메소드, 이니셜라이저, 확장등을 할 수 있습니다!

```swift
enum Month: Int {
    case january = 1
    case february
    case march
    case april
    case may
    case june
    case july
    case august
    case september
    case october
    case november
    case december

    var semester: String  { // 연산 프로퍼티
      switch self {
      case .september, .october:
          return "Autumn"
      case .november, .december, .january, .february:
          return "Winter"
      case  .march, .april, .may:
          return "Spring"
      case .june, .july, .august:
          return "Summer"
      }
    }    
}

let month = Month.april
print(month.semester) // Spring 
```

## 기본 구문

기본 구문에 대해 알아 봅시다

```swift
enum SweetFood {
    case candy
    case icecream
    case pie
}
```

쉽죠? ,를 사용해 한줄로 쭉 나열도 가능합니다

```swift
enum SweetFood {
    case candy, icecream, pie
}
```

### 축약

Enum타입으로 사용하는 변수는 컴파일러가 해당 열거형의 정보를 알고 있기 때문에 축약하여 사용할 수 있습니다.

```swift
enum SweetFood {
    case candy
    case icecream
    case pie
}

var food = SweetFood.candy 
food = .icecream

var hateFood: SweetFood = .pie
```

### 열거형 값 매칭

보통 switch문을 사용하게 되겠죠?

사용할 때 enum에 있는 모든 case를 나열해줘야 합니다. 

```swift
enum SweetFood {
    case candy
    case icecream
    case pie
}

var food = SweetFood.candy

switch food {
    case .candy:
        print("candy")
    case .icecream:
        print("icecream")
    case .pie:
        print("pie")
}
```

모든 케이스에 대한 대응이 필요 없다면 default키워드를 사용해줍니다

```swift
enum SweetFood {
    case candy
    case icecream
    case pie
}

var food = SweetFood.candy

switch food {
    case .candy:
    print("candy")
    default: 
        print("etc")	
}
```

각 케이스에 대해 ,를 사용하여 여러 열거형 값을 나열도 가능합니다 

```swift
enum SweetFood {
    case candy
    case icecream
    case pie
}

var food = SweetFood.candy

switch food {
    case .candy:
        print("candy")
    case .icecream, .pie:
        print("icecream, pie")
}
```

## 순회

열거형의 각 항목(case)에 대해 순회를 할 수 있습니다. 다만 프로토콜을 사용해야하는데요 바로 [**CaseIterable](https://sweetfood-dev.github.io/swift/CaseIterable/)** 프로토콜입니다! 

> Swift에서 열거형은 일급 클래스이라고 하였죠? 그렇기 때문에 프로토콜을 채택할 수 있습니다.
[CaseIterable에 대해 자세한 설명은 여기에서 봐주세요!](https://sweetfood-dev.github.io/swift/CaseIterable/)

```swift
enum SweetFood: CaseIterable {
    case candy
    case icecream
    case pie
}
// allCases 는 열거형의 나열된 case들을 배열로 만들어반환
// 순서는 나열된 case의 순서로!
let foodArray = SweetFood.allCases 
print(foodArray.count) // 3

for food in foodArray {
    print(food)
// candy
// icecream
// pie
}

```

CaseIterable 프로토콜은 allCases라는 연산 프로퍼티를 제공합니다.

allCases는 열거형의 case들을 나열된 순서대로 배열로 생성하여 반환해줍니다!
