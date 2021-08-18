---
title: "[Swift] 타입 프로퍼티 (Type Properties)"
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
toc: true
toc_sticky: true
toc_label: 목차
---

프로퍼티 시리즈의 마지막 주제입니다!

우리가 지금까지 알아본 프로퍼티들은 모두 **인스턴스 프로퍼티**입니다.

인스턴스를 생성할 때 마다 그 인스턴스에 속한 고유의 프로퍼티 집합들을 가지게 됩니다.

말로는 이해가 어렵지만 코드를 보면 쉽게 이해가 갈거에요

```swift
class MyType {
    var age: Int
    var weight: Int
    init(_ ageNum: Int, and weightNum: Int) {
        age = ageNum
        weight = weightNum
    }
}

let type1 = MyType(20, and: 70)
let type2 = MyType(15, and: 65)
```

type1과 type2라는 인스턴스를 생성했고 각각의 인스턴스들은 고유한 프로퍼티 age, weight를 가지고 있죠

type2.age를 30으로 설정한다고 type1.age가 같이 30으로 바뀌진 않잖아요?

이게 바로 인스턴스 프로퍼티에요.

**타입 프로퍼티**는 인스턴스에 속하는게 아닌 **타입 그 자체에 속하는 프로퍼티**를 말합니다.

위 코드에서는 MyType 자체에 속하는 프로퍼티를 말하는 거죠

그래서 타입프로퍼티는 인스턴스가 몇개 있어도 단 1개만 있게 됩니다. 위 코드에서 인스턴스 프로퍼티는 type1, type2에 존재하니 각각 2개씩 존재하는 것과는 상반되죠?

타입 프로퍼티도 인스턴스 프로퍼티 처럼 **저장, 연산 프로퍼티를 가질 수 있습니다.**

저장 타입 프로퍼티의 경우, 저장 인스턴스 프로퍼티와는 다르게 **초기 기본값**을 꼭 가져야 합니다. 

왜냐면 타입 자체는 이니셜라이저 구문이 없기 때문이죠.

마지막 특징으로 저장 타입 프로퍼티는 기본적으로 항상 **lazy하게 초기화** 됩니다. 또한 여러 스레드에서 접근을 하여도 딱 한번만 초기화되는 것을 보장해줍니다. 컴파일러가 이렇게 보장해주기 때문에 lazy 키워드는 따로 붙여주지 않아도 됩니다!

시작부터 설명이 너무 길었는데요 마지막에 최종적으로 요약을 해보도록 하겠습니다!

## 문법

사용하려는 타입 안에 **static** 키워드를 사용하여 선언해줍니다!

그리고 사용할 때는 인스턴스명이 아닌 해당 타입의 이름에 .(점)을 붙여 호출할 프로퍼티명을 작성해주면 됩니다

```swift
타입명.타입프로퍼티
```

구조체, 열거형, 클래스에서 타입 프로퍼티 사용법을 코드로 이해해 봅시다

### 구조체

```swift
struct MyStruct {
    static var structStoredProperty: String = "sweet-food"
    static var structComputeProperty: Int { 5 } 
}
```

> 예제코드에서 연산 타입프로퍼티는 get만 선언되었지만 set도 가능합니다!

### 열거형

```swift
enum MyEnum {
    static var enumStoredProperty: String = "sweet-food"
    static var enumComputeProperty: Int { 5 } 
}
```

저장 인스턴스 프로퍼티의 경우에는 열거형에서는 사용하지 못한다고 하였는데 타입 프로퍼티로는 사용할 수 있는 것 같습니다!

### 클래스

```swift
class MyClass {
    static var classStoredProperty: String = "sweet-food"
    static var classComputeProperty: Int { 5 } 
    class var overrideableComputedProperty: Int { 6 }
}
```

구조체와 열거형에서 못본 **class** 키워드가 붙은 연산 프로퍼티가 있죠?

사실 클래스에서 연산 타입 프로퍼티는 2가지 종류가 있습니다.

**오버라이드가 가능한 연산 프로퍼티**, 그렇지 않은 프로퍼티

class 키워드가 붙은 연산 프로퍼티가 바로 상속 받은 클래스에서 오버라이드가 가능한 연산 프로퍼티입니다!

```swift
class MyClass {
    static var classStoredProperty: String = "sweet-food"
    static var classComputeProperty: Int { 5 } 
    class var overrideableComputedProperty: Int { 6 }
}

class SweetFoodClass: MyClass {
    override static var overrideableComputedProperty: Int { 10 }
}
print(MyClass.overrideableComputedProperty)
// 6
print(SweetFoodClass.overrideableComputedProperty)
// 10
```

## 요약

1. 타입 프로퍼티는 타입 자체와 연결된 프로퍼티이다
2. 인스턴스 수와 상관 없이 타입 프로퍼티는 항상 1개이다
3. 타입 프로퍼티는 무조건 기본값을 가져야 한다. 제공되는 초기화 구문이 없기 때문이다
4. 타입 프로퍼티도 저장, 연산 프로퍼티를 가질 수 있다
5. 타입 프로퍼티는 항상 lazy하게 초기화 된다. 하지만 lazy 키워드는 필요 없다
6. 클래스의 연산 타입 프로퍼티는 class 키워드를 사용하여 오버라이드가 가능하도록 만들어 줄 수 있다
