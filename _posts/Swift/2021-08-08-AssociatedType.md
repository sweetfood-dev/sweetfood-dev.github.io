---
title: "[Swift] AssociatedType"
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
## AssociatedType?

열거형에서 순회를 공부하는 중에 CaseIterable이라는 프로토콜을 사용하게 되었는데

> 프로토콜은 곧 학습해서 올리도록 하겠습니다! 그냥 프로토콜이란게 있구나 하고 넘어가주세요

요놈의 정의부분을 가보니 

```swift
public protocol CaseIterable {

    /// A type that can represent a collection of all values of this type.
    associatedtype AllCases : Collection where Self == Self.AllCases.Element

    /// A collection of all values of this type.
    static var allCases: Self.AllCases { get }
}
```

이렇게 되어 있더라구요?

뭐야 associatedtyped이 뭐야 무서워...

그래서 작성하게 되었습니다!

결론만 말하면 약간 제네릭이랑 비슷한거 같아요

요 associatedtype은 **프로토콜**에서 사용하는 놈입니다

```swift
protocol MyProtocol {
    var name: Int { get }
}

struct MyStruct: MyProtocol {
    var name: Int = { 10 }
}

var mStruct = MyStruct()
print(mStruct.name) // 10 출력
```

MyProtocol을 채택하여 사용하게 되면 저 변수 name을 꼭!! 구현을 해줘야 하는데 타입은 정수형이죠?

그래서 구조체에서 구현을 해주었습니다.

하지만 Int가 아니라 String타입의 name을 사용하고 싶으면 MyProtocol이 아닌 다른 Protocol을 다시 새로 만들어 줘야 할까요?

```swift
protocol MyProtocol {
    var name: Int { get }
}

protocol MyProtocolString {
    var name: String { get }
}

protocol MyProtocolDouble {
    var name: Double { get }
}
```

딱 봐도 좀 아니죠..?

이때 associatedtype 키워드를 사용합니다

이런식으로 유연하게 타입을 바꿔주면서 사용할 수 있답니다!

```swift
protocol MyProtocol {
    associatedtype MyType 
    var name: MyType { get }
}

struct MyStruct: MyProtocol {
    var name: Int { 10 }
}

struct MyStruct2: MyProtocol {
    var name: String { "sweetfood" }
}

var numType = MyStruct()
var strType = MyStruct2()

print(numType.name) // 10 
print(strType.name) // sweetfood
```

조건을 걸어 줄수도 있어요 

```swift
protocol MyProtocol {
    associatedtype MyType: Equatable  
    var name: MyType { get }
}
```

이렇게 해주면 Equatable 프로토콜을 채택한 타입들만 name의 타입으로 사용할 수 있어요!
