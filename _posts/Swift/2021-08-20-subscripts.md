---
title: "[Swift] 서브스크립트 (Subscripts)"
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

씹고 맛보기 전에 서브 스크립트를 우리는 많이 사용해 보았습니다.

바로 배열과 딕셔너리를 사용하면서 말이죠!

```swift
var mArray = [1,2,3,4,5]
print(mArray[1]) // 2
var mDic = ["sweetFood": 1, "dev" : 2 ]
print(mDic["dev"]) // Optional(2)
```

배열과 사전에 첨자로 들어가는 [1]과 ["dev"]가 바로 subscript입니다.

클래스, 구조체, 열거형이 인스턴스명[ ]를 사용하여 해당 인스턴스 항목에 접근할 수 있게 해주는 것

그것이 **subscript**입니다.

## 문법

그럼 인스턴스를 하나 만들어서 바로 사용해봅시다!

```swift
struct Person {
    var age: Int
    var name: String
}

var sweet = Person(age: 20, name: "SweetFood")
sweet["age"]
```

이렇게 사용하면 될까?

네네 되는데 아직 우리는 subscript를 정의하지 않았기 때문에 다음과 같은 문장을 만날 수 있습니다.

> Value of type 'Person' has no subscripts

우리가 선언한 타입은 subscripts를 가지고 있지 않기 때문에 발생한 오류입니다.

그럼 만들어 주면 되겠죠?

subscript의 선언은 **함수와 연산 프로퍼티를 적당히 섞인 형태**를 가지고 있습니다.

```swift
subscript(매개변수명: 매개변수 타입) -> 반환타입 {
    get { }
    set(매개변수명) { }
}
```

정의부는 함수와 비슷한데 func 키워드 그리고 함수이름 자리에 **subscript 키워드**가 차지하고 있고 그 뒤에는 함수와 판박이죠.

본문은 연산프로퍼티처럼 getter와 setter로 이루어져 있습니다. 연산 프로퍼티와 모든게 같다고 보시면 됩니다.

set은 사용하지 않고 읽기 전용처럼 사용할 수 도 있습니다.

다만 유의해야할 점이 있는데요.

subscript의 매개변수로는 단일 매개변수, 가변 매개변수, 기본 변수값을 사용할 수 있지만

**inout** 키워드는 **사용할 수 없습니다.**

setter의 매개변수(생략하였을 땐 newValue겠죠?)의 타입은 매개변수 타입이 아닌 

**subscript의 반환타입과 일치**합니다.

요 2가지는 유의하여 사용해야겠습니다!

## 사용

자 그럼 본격적으로 사용해볼까요?

```swift
struct Person {
    var age: Int
    var name: String

    subscript(key: String) -> String {
        switch key { 
        case "age" :
            return String(age)
        case "name" :
            return name
        default :
            return "invalid"
        }
    }
}

var sweet = Person(age: 20, name: "SweetFood")
sweet["age"] // "20"
sweet["name"] // "SweetFood"
sweet["sweetfood"] // "invalid"

```

네 잘 되네요.

이게 subscript의 전부입니다.

## 옵션

subscript의 매개변수와 반환은 어떠한 타입이라도 가능합니다.

앞에서도 확인할 수 있듯이 단일인자, 가변인자, 기본 변수값도 가능하지만 inout은 사용할 수 없습니다.

그리고 필요한 만큼 subscript를 만들어서 사용할 수 있습니다. 위의 예제에서는 하나의 subscript만 정의하여 사용하였지만 여러 subscript를 선언하여 사용할 수 있다는 거죠!

네 바로 **오버로딩**이 가능하다는 겁니다!

```swift
struct Person {
    var age: Int
    var name: String

    subscript(key: String) -> String {
        switch key { 
        case "age" :
            return String(age)
        case "name" :
            return name
        default :
            return "invalid"
        }
    }

    subscript(index: Int) -> Int {
        get { age * 3 }
    }
}

var sweet = Person(age: 20, name: "SweetFood")
sweet["age"] // "20"
sweet["name"] // "SweetFood"
sweet["sweetfood"] // "invalid"

sweet[3] // 60
```

추가로 정의한 subscript는 Int 타입을 받아 그 정수를 age와 곱하여 반환 합니다.

그래서 지금 저희가 사용하고 있는 subscript는 총 2개죠.

Swift는 여러 subscript 중 **매개변수의 타입을 기반으로 추론**하여 사용할 subscript를 실행 시킵니다.

> 저는 반환 타입까지 고려하는 줄 알았는데 반환 타입과는 상관 없이 매개변수 타입으로만 구분하더라구요!

```swift
subscript(index: Int) -> String // 사용 가능
subscript(key: String) -> String // 사용 가능
// subscript(index: Int) -> String와 같은 매개변수 타입 에러에러 ㅠ
subscript(index: Int) -> Int 
```

우리가 subscript를 선언할 때

```swift
subscript(key: String) -> String
subscript(index: Int) -> Int
```

이렇게 선언하고 사용할 때는

```swift
var sweet = Person(age: 20, name: "SweetFood")
sweet["age"] // "20"
sweet[3] // 60
```

이렇게 사용을 했는데요. 이는 key:와 index:를 생략하고 사용한거죠?

네 subscript에서 매개변수명은 생략할 수 있습니다. 아니 생략해야만 합니다. 안그럼 오류가 나거든요..

```swift
var sweet = Person(age: 20, name: "SweetFood")
//Extraneous argument label 'key:' in subscript
sweet[key: "age"] // "20"
```

근데 구체적인 이름을 지정하고 싶을 수 있잖아요? 친절한 Swift님은

**인자레이블명**을 사용할 수 있게 해주셨습니다.

```swift
struct Person {
    var age: Int
    subscript(increaseAt num: Int) -> Int {
        get { age + 3 }
    }
}

var sweet = Person(age: 20)
sweet[increaseAt:3] // 60
```

Good!

## Type Subscripts

subscript 또한 타입 프로퍼티, 타입 메소드처럼 동작할 수 있습니다.

```swift
struct Person {
    static var name = "SweetFood"

    static subscript(comment: String) -> String {
        "\(name) \(comment)"
    }
}

Person["hello"]
// SweetFood Hello
```

## 정리

1. subscript는 [ ]를 사용하여 인스턴스 항목을 사용할 수 있다
2. subscript의 매개변수로는 inout을 사용할 수 없다
3. subscript는 오버로딩이 가능하며 매개변수의 타입으로 구분을 한다
4. setter의 매개변수는 subscript의 반환 타입과 같다
