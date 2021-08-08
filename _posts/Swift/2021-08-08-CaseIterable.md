---
title: "[Swift] CaseIterable"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Protocol
toc: true
toc_sticky: true
toc_label: 목차
---

## CaseIterable?

CaseIterable? 반복가능한 케이스? 케이스 반복가능?

케이스에 대해 반복 가능하게 해주는 뭐 그런 프로토콜인거 같죠?

직접 찾아 가봅시다!

```swift
public protocol CaseIterable {

    /// A type that can represent a collection of all values of this type.
    associatedtype AllCases : Collection where Self == Self.AllCases.Element

    /// A collection of all values of this type.
    static var allCases: Self.AllCases { get }
}
```

associateType은 [여기](https://sweetfood-dev.github.io/swift/AssociatedType/)를 참고하세요

CaseIterable을 채택하면 allCases 프로퍼티를 사용할 수 있군요

allCases프로퍼티는 열거형의 모든 케이스에 대한 collection을 만들어 줍니다.

프로토콜만 채택하면 allCases 프로퍼티를 통해 케이스들의 배열을 얻을 수 있는 셈이죠!

```swift
enum SweetFoodEnum: CaseIterable {
    case sweet
    case food
    case hello
    case world
}

for cases in SweetFoodEnum.allCases {
    print(cases) 
// sweet
// food
// hello
// world
}
print(SweetFoodEnum.allCases.count) // 4 
```

## 제약

하지만 제약사항이 있어요 

case에 연관 값이 있는경우, unavailable 마크가 사용되는 경우등에는 사용할 수 없답니다

```swift
enum SweetFoodEnum: CaseIterable {
    case sweet
    case food(with: String) // 연관 값 사용
    case hello
    @available(*, unavailable) // unavailable 마크
    case world
}
```

## 사용자 정의

걱정마세요! 위처럼 연관값이 있는 경우엔 우리 입맛에 따라 allCases를 직접 만들어 줘서 사용하면 됩니다!

```swift
enum SweetFoodEnum: CaseIterable {
    case sweet
  case food(with: String) // 연관 값 사용
  case hello
  @available(*, unavailable) // unavailable 마크
  case world

    static var allCases: [SweetFoodEnum] {
        return [.sweet, .food(with: "burger")]
    }
}
```

연관 값도 사용할 수 있고 몇가지 케이스는 없애버릴 수도 있죠!
