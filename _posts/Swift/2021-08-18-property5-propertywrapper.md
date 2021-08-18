---
title: "[Swift] 프로퍼티 랩퍼 (Property Wrapper)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Property
- Swift5.1
toc: true
toc_sticky: true
toc_label: 목차
---

## 선행 지식

저장프로퍼티와 연산프로퍼티에 대해 미리 보고 오시면 이해하는데 도움이 됩니다!

[저장 프로퍼티](https://sweetfood-dev.github.io/swift/property2-savedProperty/)

[연산 프로퍼티](https://sweetfood-dev.github.io/swift/property3-computedProperty/)

## 프로퍼티 랩퍼?

Swift 5.1에서 추가된 프로퍼티 랩퍼는 말 그대로 프로퍼티를 감싸는? 뭐 그런놈인거 같습니다

그래 뭐 감싸서 어디에 사용하려고 ? 라고 묻는 다면 다음과 같은 가정을 통해 이해를 해보자구요

> 마을의 주소와 사람의 이름을 대문자로 출력하고 싶어!

음 그럼 각각 **주소** / **이름이라는 프로퍼티**를 가진 **마을이라는 타입과** **사람이라는 타입을** 선언해서 **대문자로 출력**하면 되겠네.

단순히 대문자로 출력하는 거니 **연산 프로퍼티를 사용**해도 되겠어

자 그럼 이걸 코드로 작성 해봅시다

```swift
// 마을 
struct Town {
    // 마을 이름 (저장 프로퍼티)
    private var _address: String = ""
    // 마을 이름의 연산 프로퍼티
    var address: String { 
        // uppercased()는 대문자로 구성된 문자열 반환
        get { _address.uppercased() }
        set { _address = newValue } 
}

struct Person {
    private var _name: String = ""
    var name: String { 
        get { _name.uppercased() }
        set { _name = newValue } 
}
```

짜잔! 되었네요

근데 뭔가 불편합니다. getter와 setter의 로직이 똑같습니다.

이 때 저런 중복된 로직들을 PropertyWrapper로 묶어 주어 보일러 플레이트 코드와 코드 재사용성을 높여 줍니다

> 보일러 플레이트는 반복적으로 사용되는 코드를 말합니다.

## 정의 그리고 사용

프로퍼티를 사용할 수 있는 타입인 클래스, 구조체, 열거형을 선언해 주고

타입의 선언 앞 부분에 이건 PropertyWrapper로 사용할거야~ 하는 

@propertyWrapper를 명시해줍니다.

```swift
@propertyWrapper struct Uppercased {
}
```

그럼 아마 오류가 나올거에요 

> Property wrapper type 'Uppercased' does not contain a non-static property named 'wrappedValue'

프로퍼티 랩퍼로 사용할 녀석은 wrappedValue 이름을 가진 프로퍼티를 가져야 한다는 거겠죠

wrappedValue에 반복적인 로직을 사용하는 코드를 넣어 줍니다. 

나중에 나오겠지만 랩퍼를 사용하는 프로퍼티는 최종적으로 이 wrappedValue를 호출하기 때문이죠!

자 그럼 넣어 줍시다

```swift
@propertyWrapper struct Uppercased {
    private var _name: String = ""
    var wrappedValue: String {
        get { _name.uppercased() }
        set { _name = newValue } 
    }
}
```

자 그럼 정의는 끝났으니 사용해 볼까요?

랩퍼를 사용하는 프로퍼티를 선언할 때는 앞에 @랩퍼명을 붙여 줍니다.

여기서는 @Uppercased가 되겠죠?

```swift
struct Town {
    // wrappedValue의 타입인 String으로 일치 시켜줍니다.
    @Uppercased var address: String	
}

var mTown = Town()
mTown.address = "sweetdev"
print(mTown.address)
// SWEETDEV
```

attribute syntax(@랩퍼명)을 사용하지 않고 명시적으로 프로퍼티 랩퍼 타입을 생성하여 사용도 가능합니다

```swift
struct Town {
    var wrapperAddress = Uppercased()
}

var mTown = Town()
mTown.wrapperAddress.wrappedValue = "sweetfood"
print(mTown.wrapperAddress.wrappedValue)
// SWEETFOOD
```

attribute syntax를 사용하면 wrappedValue와 wrapperAddress를 자동으로 연결해준다고 합니다. 그리고 실제로 더 깔끔하겠죠? 

> 랩퍼를 적용하면 컴파일러는 랩퍼를 저장하는 코드와 랩퍼를 통해 프로퍼티에 접근하는 코드를 자동으로 synthesize 해준다고 하네요!

## 초기화

Swift에서 구조체, 클래스가 가진 프로퍼티들은 초기값을 가져야만 합니다.

선언 시점에는 초기값이 없더라도 초기화를 통해 초기값을 가져야만 합니다. (예외로 옵셔널은 초기값을 지정해주지 않아도 되지만 이는 옵셔널 타입의 기본 값이 nil로 정해져 있답니다.)

만약 초기값을 주지 않는 다면 컴파일러가 에러를 분출하게 됩니다.

위의 예시에서 프로퍼티 랩퍼 Uppercased의 저장 프로퍼티 _name은 ""로 초기값을 가지고 있는 상태죠.

가이드북의 예제를 통해 초기값을 설정하는 법을 알아 봅시다!

### 인수가 없는 초기화

```swift
@propertyWrapper struct SmallNumber {
    private var number: Int
    private var maximum: Int

    var wrappedValue: Int {
        get { number }
        set { number = min(newValue, maximum) }
    }

    init() {
        number = 0
        maximum = 12
    }
}

struct SmallRect {
    @SmallNumber var number: Int
}

var mRect = SmallRect()
print(mRect.number)
// 0
```

프로퍼티 선언시 초기값을 설정해 주지 않더라도 기본 이니셜라이저로 처음 생성 될 때 number는 0, maximum은 12로 초기화 됩니다.

### 인수가 1개 있는 초기화

```swift
@propertyWrapper struct SmallNumber {
    private var number: Int
    private var maximum: Int

    var wrappedValue: Int {
        get { number }
        set { number = min(newValue, maximum) }
    }

    init() {
        number = 0
        maximum = 12
    }

    init(wrappedValue value: Int) {
        maximum = 12
        number = value
    }
}

struct SmallRect {
    @SmallNumber(wrappedValue: 3) var number: Int
    // 혹은
    @SmallNumber var number = 3
}

var mRect = SmallRect()
print(mRect.number)
// 3
```

인수가 1개 있을 때는 2가지 방법으로 초기화 할 수 있습니다.

위처럼 attribute syntex에 생성자로 사용할 수 있고. 할당 연산자 = 를 사용하여도 

init(wrappedValue:)가 호출됩니다. 아마 wrappedValue인자에 자동으로 연결되어지는거 같아요?

다만 할당 연산자로 이니셜라이저를 호출하고 싶다면 인수명이 꼭 wrappedValue여야 합니다.

만약 임의로 int(devValue:)로 생성할 경우 할당 연산자를 사용한 이니셜라이저 호출이 안된다는 점

명심하세요!

### 인수가 여러개 있는 경우

```swift
@propertyWrapper struct SmallNumber {
    private var number: Int
    private var maximum: Int

    var wrappedValue: Int {
        get { number }
        set { number = min(newValue, maximum) }
    }

    init() {
        number = 0
        maximum = 12
    }

    init(wrappedValue value: Int) {
        maximum = 12
        number = value
    }

    init(wrappedValue value: Int, maxNumber: Int) {
        maximum = maxNumber
        number = value
    }
}

struct SmallRect {
    @SmallNumber(wrappedValue: 3, maxNumber: 20) var height: Int
    @SmallNumber(maxNumber: 20) var width = 5
}

var mRect = SmallRect()
print(mRect.height)
// 3
print(mRect.width)
// 5
```

init(wrappedValue, maxNumber:) 2개의 인자를 받는 이니셜라이저입니다.

사용할때는 SmallNumber(wrappedValue: 3, maxNumber: 20) 이런식으로 사용도 되지만

할당 연산자는 wrappedValue인자에 자동으로 연결 되는거 같다고 하였죠?

@SmallNumber(maxNumber: 20) var width = 5 를 보시면 할당연산자를 사용하여도 

init(wrappedValue, maxNumber:) 2개의 인자를 받는 이니셜라이저를 호출하게 됩니다.

초기화에 대해 이런저런 설명을 많이 하였지만 사실 랩퍼를 구조체로 사용하면 구조체 초기화의 특징,

클래스로 사용하면 클래스 초기화의 특징을 가지는거 같습니다.  = 할당연산자를 사용하면

wrappedValue 인자에 매칭이 된다는 것만 추가로 알고 있으면 될 것 같습니다!

### projectedValue

랩퍼는 값과 더불어 projectedValue 프로퍼티를 사용하여 

추가적인 정보를 제공할 수도 있다고 합니다.

```swift
@propertyWrapper struct SmallNumber {
    var number: Int = 0
    var projectedValue = false
    var wrappedValue: Int {
        get { number }
        set { 
            projectedValue = newValue > 12 ? true : false
            number = min(12, newValue)			
        }	
    }
}

struct SweetFood {
    @SmallNumber var mNumber: Int
}

var dev = SweetFood()
print(dev.$mNumber) // false
print(dev.mNumber) // 0
dev = 14
print(dev.$mNumber) // true
print(dev.mNumber) // 12
```

SmallNumber 랩퍼를 사용하는 프로퍼티는 최대 12의 정수를 할당할 수 있습니다.

초과하는 정수가 들어오면 12로 할당해버리고 projectedValue를 true로 설정합니다.

projectedValue가 의미하는건 강제로 정수가 조정되었다는 것이죠!

이 랩퍼를 사용하는 프로퍼티 mNumber를 그냥 사용하면 wrappedValue가 나오지만

$를 프로퍼티명 앞에 붙여주면 projectedValue를 사용할 수 있습니다!

## 정리

1. property wrapper는 프로퍼티는 저장하는 로직의 코드와 정의하는 코드를 분리한다
2. property wrapper를 정의 할 때는 클래스, 구조체, 열거형 앞에 @propertyWrapper 키워드를 사용
3. 사용할 때는 사용할 프로퍼티 앞에 @랩퍼명을 붙여 준다
4. 추가로 제공할 정보가 있다면 projectedValue를 정의하고 사용할 땐 프로퍼티명 앞에 $를 붙여주자
