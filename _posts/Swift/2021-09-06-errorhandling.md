---
title: "[Swift] 오류 처리 (Error handling)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Error Handling
toc: true
toc_sticky: true
toc_label: 목차
--- 

오류 처리는 오류 상태에 대응하고 복구하는 프로세스

Swift는 에러가 발생한 경우 에러 처리를 위해

throw(발생), catching(감지), propagating(전파), manipulating(조작)을 지원하는 일급 클래스를 지원함

## 에러 표시와 던지기(throw)

Swift에서 에러는 **Error 프로토콜**을 준수하는 타입의 값으로 표현(구현)이 가능

Error 프로토콜을 채택한 타입은 에러 처리를 위해 사용할 수 있는 타입을 의미

> Error 프로토콜은 빈 프로토콜이지만 Swift는 Error를 채택한 타입에 대해 에러 처리를 위한 타입으로 인식

```swift
enum SomeError: Error { // Error 프로토콜을 채택
}
```

Swift의 **열거형은 에러를 그룹화 하는데 적합**

관련값(Associated Value)을 사용한 추가 정보전달이 가능

에러를 발생시켜 예상치 못한 문제가 발생되어 정상적인 작업을 할 수 없다고 알려줄 수 있음

에러를 발생시키기 위해 **throw** 구문을 사용

```swift
enum VendingMachineError: Error {
    case invalidSelection
    case needCoins(needCoin: Int)
    case outOfStock
}
```

열거형 VendingMachineError는 Error 프로토콜을 채택하여 정의

```swift
throw VendingMachineError.needCoins(needCoin: 5)
```

동전이 5원 모자르면 needCoins를 **throw하여 에러를 표시, 발생**할 수 있음

## 에러 처리 (Error Handling)

위와 같이 에러를 throw한 경우 발생한 에러를 **처리** 해야함

Swift에서는 에러 처리에 4가지 방법이 있음

1. 함수에서 에러가 발생하면 함수는 에러를 반환 하고 함수를 호출한 곳에서 에러를 처리
2. do - catch 구문을 사용하여 처리
3. 옵셔널 값을 반환 ( 에러 발생 시 nil 반환이 가능 )
4. assert를 사용하여 강제로 crash를 발생

**에러가 발생할 수 있는 코드(throwing 함수) 앞에 try, try?, try!를 키워드를 사용**

### 에러를 반환하는 함수의 사용

함수, 메소드, 이니셜라이저가 오류를 발생시킬 수 있음을 알리기 위해 함수 선언에서 매개변수 뒤에 
**throws 키워드**를 사용

이러한 함수를 **던지기 함수, throwing 함수**라고 함

반환값이 있는 함수라면 **매개변수와 → 사이에 throws 키워드를 작성**

throwing 함수는 함수안에서 에러를 발생시켜 호출자에게 에러를 반환

오직 **throwing 함수만 에러를 반환**할 수 있으며 그렇지 않은 **일반적인 함수는 에러를**

**내부에서** **처리**해야함

```swift
enum VendingMachineError: Error {
    case invalidSelection
    case needCoins(needCoin: Int)
    case outOfStock
}

struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    
    var coinsDeposited = 0

    func vend(itemNamed name: String) throws {
        // 딕셔너리 inventory에 없는 상품이면 invalid 에러를 발생
        guard let item = inventory[name] else {
            // return이 아니라 throw
            throw VendingMachineError.invalidSelection
        }
        // 재고가 없으면 outOfStock 에러를 발생
        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }
        
        guard item.price <= coinsDeposited else {
            throw VendingMachineError.needCoins(needCoin: item.price - coinsDeposited)
        }
        
        coinsDeposited -= item.price

        var newItem = item
        newItem.count -= 1
        inventory[name] = newItem

        print("Dispensing \(name)")
    }
}
```

자동판매기 VendingMachine 클래스를 정의

함수 vend(itemNamed:)는 에러를 발생시킬 수 있는 throwing 함수

1. 딕셔너리 inventory에 파라미터로 입력받은 name 상품이 없으면 invalidSelection 에러를 발생

> return 이 아니라 throw 키워드!

1. name 이름을 가진 상품은 있지만 재고가 없다면 outOfStock 에러를 발생
2. 상품의 가격이 자판기에 들어온 금액보다 비싸다면 needCoins 에러를 발생, 이 때 부족한 돈을 연관값으로 제공

상품을 구매하기 위해 요구사항을 만족하지 않는 경우 함수를 종료하고 적절한 에러를 반환 

vend(itemNamed:) 메서드는 에러를 발생 시키고 전파하기 때문에 이 메서드를 호출하는 곳에서는

**do-catch, try?, try! 를 사용하여 에러를 처리하거나 throw를 사용하여 계속 전파(전달)해야함**

```swift
let favoriteSnacks = [
    "Alice": "Chips",
    "Bob": "Licorice",
    "Eve": "Pretzels",
]
func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
     let snackName = favoriteSnacks[person] ?? "Candy Bar"
     try vendingMachine.vend(itemNamed: snackName)
}
```

예를 들면 위의 buyFavoriteSnack(person:, vendingMachine:) 함수는 vend(itemNamed:) 메서드가

에러를 발생시키면 buyFavoriteSnack함수를 호출 한 곳 까지 해당 에러를 전달함

이 예에서 vend(itemNamed:) 메서드는 에러를 발생시킬 수 있는 코드이기 떄문에 앞에 try 키워드를

사용하여 호출

```swift
struct PurchasedSnack {
    let name: String
    init(name: String, vendingMachine: VendingMachine) throws {
        try vendingMachine.vend(itemNamed: name)
        self.name = name
    }
}
```

throwing 함수와 같이 throws 키워드를 사용하여 이니셜라이저에서도 에러를 발생시킬 수 있음

초기화 중에 에러가 발생할 시 이 이니셜라이저를 호출한 코드에 에러를 전달하여 처리하도록 할 수 있음

### 정리

1. 에러를 발생 시킬 수 있는 함수, 이니셜라이저에는 **throws** 키워드를 사용
2. 에러를 발생 시킬 때는  **throw** 사용

```swift
throw Error.에러값
```

1. 에러를 발생 시킬 수 있는 함수, 이니셜라이저를 **사용시에는 try** 키워드를 사용
2. **에러가 발생 되면 꼭 처리를 해야함**, 그렇지 않으면 다시 재전달 해야함

### Do - Catch를 사용한 에러 처리

에러가 발생하였다면 해당 에러를 처리해야함

에러 처리를 위해서는 **do-catch** 문을 사용

do 코드에 의해 에러가 발생, 감지 되면

발생하는 에러의 종류를 catch 구문으로 구분해 처리할 수 있음

```swift
do {
    try expression
    statements
} catch pattern 1 {
    statements
} catch pattern 2 {
    statements
} catch {
    statements
}
```

catch 키워드 뒤에 에러 항목이 없으면 모든 에러 항목을 일치 시키고 상수 error에 에러 항목을 바인딩 시킴

```swift
var vendingMachine = VendingMachine()
vendingMachine.coinsDeposited = 8

do {
    try buyFavoriteSnack(person: "Alice", vendingMachine: vendingMachine)
    print("Success")
} catch VendingMachineError.invalidSelection {
    print("invalid selection")
} catch VendingMachineError.outOfStock {
    print("out of stock")
} catch VendingMachineError.needCoins(let needCoins) {
    print("addtional \(needCoins) coin")
} catch { print("Unexpected error : \(error)") }
```

VendingMachine의 모든 에러에 대해 대응 / 처리하는 예제 코드

do 구문 안에서 에러를 발생 시키는 buyFavoriteSnack 함수를 try 키워드로 실행 

에러가 발생하면 적절한 catch 문안에서 처리함

do 에서 발생할 수 있는 모든 에러를 처리할 필요는 없음

해당 에러를 처리하는 catch 문이 없다면 주변으로 에러가 전파되기 때문

단, **발생한 에러는 관련된 특정 코드 영역안에서는 반드시 처리되야한다.**

**에러를 발생시킬 수 있는 함수**에서는 do-catch로 에러를 처리하거나, 함수를 호출 한 곳에서 처리를 해야한다

**에러를 발생시킬 수 없는 함수**에서는 do-catch로 에러를 처리해야한다.

최상위 호출자 까지 에러를 처리하지 않으면 런타임 에러가 발생된다.

```swift
func throwFunc() throw {
    do { try throwFunc2() }
    catch { }
}
func throwFunc2() throw {
    try throwFunc3()
}
func throwFunc3() throw {
    throw ErrorType.someerror
}
```

→ 위와 같은 코드가 있을 때 

throwfunc2(), throwfunc3()은 모두 catch하여 처리하지 않지만

최상위 호출자인 throwFunc()에서는 에러를 처리 하듯, 발생한 에러는 최대 최상위 호출자에서는 처리 되야 한다는 뜻!

### 에러를 옵셔널로 변환하기

try?를 사용하면 에러를 옵셔널 값으로 변환할 수 있다.

**try? 를 사용하여 에러가 발생하면 그 값은 Error타입의 값이 아닌 nil로 변환이 됨.**

```swift
func someThrowingFunction() throws -> Int {
 ...
}

let x = try? someThrowingFunction()

let y: Int?
do {
    y = try someThrowingFunction()
} catch {
    y = nil
}
```

위 코드에서 x와 y는 같은 값을 가짐

### Disabling error propagation

throwing 함수나 메서드를 사용할 때 에러가 발생하지 않을 것이라는 확신이 들면

try!를 사용할 수 있다.

하지만 만약 에러가 발생할 때는 런타임 에러가 발생되니 주의하여 사용할 것

```swift
let photo = try! loadImage(atPath: "./Resources/John Appleseed.jpg")
```
