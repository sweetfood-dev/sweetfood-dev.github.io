---
title: "[Swift] 저장 프로퍼티 (Stored properties)"
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

## 저장 프로퍼티란?

저장 프로퍼티는 클래스, 구조체 인스턴스의 일부로 값이 저장되는 상수 혹은 변수입니다!

상수는 변하지 않는 값 let으로 선언하고 변수는 변하는 값 var로 정의하죠!

자 그럼 인스턴스에서 저장 프로퍼티를 사용하는 법에 대해 함께 알아봅시다!

## 기본값

인스턴스에서 저장 프로퍼티는 보통 초기화를 통해 값을 설정하지만

기본 값을 설정할 수도 있습니다! ( 함수 파라미터의 기본 값과 같다고 보면 됩니다!)

```swift
struct IceCream {
    var name: Strig = "빠삐코"
    var ingredients: String
}

var iceCream = IceCream(ingredients: "choco")
print("iceCream name : \(iceCream.name) ingredients: \(iceCream.ingredients)")

iceCream = IceCream(name: "메로나", ingredients:"melon")
print("iceCream name : \(iceCream.name) ingredients: \(iceCream.ingredients)")
```

기본값이 주어진 저장 프로퍼티는 구조체 인스턴스의 초기화 때 생략 가능해요!

물론 생략하지 않고 설정하는 것도 가능합니다! 

## 상수 / 변수 구조체에서의 저장 프로퍼티

구조체를 사용할 때 조금 유의하셔야 할 점이 있습니다!.

```swift
struct Contact {
    var fullName: String
    var emailAddress: String
}

var person = Contact(fullName: "SweetFood", emailAddress: "food@dev.com")
person.fullName = "dev"
```

요 코드는 잘 동작하죠? 근데 person을 var가 아닌 let으로 변경하면?

```swift
struct Contact {
    var fullName: String
    var emailAddress: String
}

let person = Contact(fullName: "SweetFood", emailAddress: "food@dev.com")
person.fullName = "dev"
```

> Cannot assign to property: 'person' is a 'let' constant

요런 에러가 발생합니다!

person이 바로 상수(let)로 선언되었기 때문에 fullName이 변수 속성이더라도 이 속성을 변경할 수 없기 때문입니다.

그 이유는 바로 **구조체가 값 타입**이기 떄문이죠!

반면 클래스는 참조 타입이여서 let으로 선언하여도 변경이 가능하죠! 자세한 설명은 [여기](https://sweetfood-dev.github.io/swift/StructAndClass/#값-타입과-참조-타입)를 참조해주세요!

## 지연 저장 프로퍼티(Lazy Stored Properties)

지연 저장 프로퍼티는 성능향상을 위해 사용된다고 해요.

프로퍼티들은 보통 인스턴스가 생성될 때 값이 할당되는데 값을 생성할 때 자원이 많이 소모 되는 경우에 사용하면 좋다고 합니다. 글로 봐선 모르겠죠? 저도 처음 읽을 때는 글로봐서는 이해가 힘들더라구요 ㅠ

친절한 애플씨의 예제를 보면서 이해를 해봅시다!

```swift
class DataImporter {
// DataImporter는 저장 프로퍼티 filename밖에 안보이지만 초기화시 
// filename의 파일을 불러오는 클래스라고 "가정 혹은 상상" 해봅시다!
// 파일을 가져오기 때문에 초기화하는데 시간이 오래 걸린다고도 가정합시다!
    var filename = "data.txt"
}

class DataManager {
	// DataManager는 data를 관리하는 클래스라고 가정합시다!
    lazy var importer = DataImporter()
    var data: [String] = []
}

let manager = DataManager()
manager.data.append("Some data")
manager.data.append("Some more data")
```

가정해야할게 참 많지만 그래도 이해를 쉽게 하기 위한 애플님들의 마음이니 가정을 해줍시다!

DataManager는 data를 관리하는 클래스라고 했죠

manager라는 인스턴스를 만들어서 열심히 data에 값을 넣어주고 있습니다.

자 여기서 볼 수 있듯이 DataImporter가 없어도 data 관리를 잘하고 있죠?

DataImporter가 파일을 가져오지 않아도 우리는 데이터를 잘 관리할 수 있습니다.

DataImporter는 인스턴스를 만들 때 시간이 오래 걸린다고 하였으니 초기화가 오래걸리니까요!)

**실제로 DataImporter를 사용할 때** **인스턴스를 만드는 것**이 합리적이고 효율적이겠죠?

네 바로 이런 경우에 **lazy** 키워드를 사용하여 성능에 도움을 줄 수 있다!

### 유의사항

lazy를 사용할 때는 유의해줘야할 사항이 있어요!

lazy를 사용하는 프로퍼티는 **무조건 var**로 선언해줘야 합니다. let을 사용하면 컴파일 단계에서 에러가 나옵니다!

그 이유는 **값이 변하기 때문**입니다.

보통 저장 프로퍼티들은 구조체나 클래스가 **초기화 완료 전**에 **값이 할당** 됩니다.

근데 lazy의 경우는 초기화가 될 때 lazy 프로퍼티는 **값이 없는 상태**입니다. 그리고 **실제로 사용할 때 값이 할당** 되죠

값이 없는 상태 → 값이 할당 어라? 값이 변하죠? 그래서 var로 선언을 해줘야 해요!

```swift
struct Contact {
    var name = "sweetfood"
    lazy var relation = "friend"
}

var person = Contact()
print("before \(person)")
print(person.relation)
print("after \(person)")
/* 출력 결과
before Contact(name: "sweetfood", $__lazy_storage_$_relation: nil)
friend
after Contact(name: "sweetfood", $__lazy_storage_$_relation: Optional("friend"))
*/
```

이렇게 출력해보면 눈에 확 들어옵니다!

> 앞서 말했듯이 person도 let으로 선언하시면 안되요! 구조체 인스턴스를 let으로 선언하면 프로퍼티들이 var로 선언되어 있어도 변경이 안되니까요!

lazy로 사용된 relation을 사용하기 전에는 nil로 되있는 거 보이시죠!?

그리고 실제로 사용 후에는 Optional("friend")로 값이 들어가 있습니다. 

> 어 근데 옵셔널로 감싸져있는건 의외네요? 이건 저도 좀 더 알아봐야겠습니다 ㅠ 아시는분 계신가요?
→ 다시 생각해보니 처음엔 nil 이고 나중에 값이 들어오니 당연히 옵셔널이겠네요..? 하하
사용할 때는 컴파일러가 알아서 옵셔널을 해제해주나 봅니다!

한 가지 더 유의할 사항은!

기본적으로 lazy는 **싱글 스레드** 에서는 한번만 초기화 되는 걸 보장합니다

하지만 **초기화가 안된 상태**에서 **멀티 스레드**에서 lazy 프로퍼티를 **동시에 접근**하게 될 경우 한번만 초기화 되는걸 보장하지 않습니다!

멀티 스레드 환경에서는 미리 초기화를 하고 사용하라는 애플의 권고 같네용!

다음엔 연산프로퍼티를 정리 해보도록 하겠습니다!.

## 정리

1. 저장프로퍼티는 기본값을 가질 수 있다
2. 구조체가 let으로 선언되었다면 프로퍼티가 var로 선언되었어도 값을 변경할 수 없다
3. lazy를 사용할 때는 var로 선언해야 한다. lazy var는 세트다
