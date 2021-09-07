---
title: "[Swift] 중첩된 타입 (Nested Type)"
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

열거형의 경우 구조체, 클래스의 기능들을 지원하기 위해 자주 사용됨

복잡한 타입을 구성하는 경우 유틸리티 클래스와 구조체를 정의할 수 있음

Swift에서는 이를 위해 

열거형, 구조체, 클래스 **타입의 안에** 열거형, 구조체, 클래스 **타입을 정의**할 수 있도록 지원함

이를 **중첩된 타입**이라함

## 중첩된 타입의 사용

```swift
struct BlackjackCard {

    // nested Suit enumeration
    // struct 안에 enum타입의 선언
    enum Suit: Character {
        case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
    }

    // nested Rank enumeration
    enum Rank: Int {
        case two = 2, three, four, five, six, seven, eight, nine, ten
        case jack, queen, king, ace
        struct Values { // enum안에 struct타입 선언
            let first: Int, second: Int?
        }
        var values: Values {
            switch self {
            case .ace:
                return Values(first: 1, second: 11)
            case .jack, .queen, .king:
                return Values(first: 10, second: nil)
            default:
                return Values(first: self.rawValue, second: nil)
            }
        }
    }

    // BlackjackCard properties and methods
    let rank: Rank, suit: Suit
    var description: String {
        var output = "suit is \(suit.rawValue),"
        output += " value is \(rank.values.first)"
        if let second = rank.values.second {
            output += " or \(second)"
        }
        return output
    }
}
```

위 코드를 보면 BlackjackCard의 구조체 안에 

열거형 Suit, Rank 타입이 정의되어 있음

또한 열거형 Rank 타입안에는 구조체 Values가 정의되어 있음

## 중첩 타입의 참조

중첩 타입이 정의된 타입의 내부가 아닌 외부에서 사용하려면

즉, 선언된 곳의 밖에서 사용하려면

선언이된 타입부터 차례대로 모두 작성해야함

```swift
var outerValues = BlackjackCard.Rank.Values(first: 2, second: 3)
print(outerValues.first)
print(outerValues.second!)
```

구조체 Values를 사용하기 위해서는

BlackjackCard.Rank.Values 처럼 모든 타입명을 바깥에서 안쪽으로 접근하여 사용
