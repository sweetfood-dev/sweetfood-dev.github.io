---
title: "[Swift]초기화 해지 (Deinitialization)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Deinitialization
toc: true
toc_sticky: true
toc_label: 목차
--- 

클래스의 인스턴스가 해지되기 **직전**에 호출되며

**deinit** 키워드를 사용하여 정의

**클래스 타입에서만 사용** 가능

## 초기화 해제의 동작

Swift는 필요하지 않은 인스턴스를 자동으로 해제하여 리소스를 확보함

이러한 메모리 관리를 **ARC**를 통해 진행

> ARC는 Swift의 메모리 관리 시스템

ARC가 메모리 관리를 해주어 수동으로 정리르 할 필요는 없으나 정리를 직접 수행해야 할 경우도 있음

예를 들어 파일 관리를 하는 클래스가 인스턴스에서 해제 될 때 해당 해당 파일을 닫는 경우

이러한 정리를 할 수 있는 곳이 deinit 인 것 같음

초기화 해제는 클래스당 최대 1개를 사용할 수 있으며 클래스 타입에서만 사용이 가능 하다

```swift
deinit {
}
```

deinit은 인스턴스가 해제 되기 직전에 호출되며 직접 호출은 불가하다

상속을 받았다면 자동으로 상속을 받고 서브클래스의 deinit이 종료된 후 자동으로 상위 클래스의 deinit이 호출됨

서브클래스에서 deinit을 선언하지 않았더라도 상위 클래스의 deinit은 호출됨

```swift
class SuperClass {
    deinit { print("Super Class deinit") }
}
class SubClass: SuperClass { 
    deinit { print("Sub Class deinit") }
}

var someClass: SubClass?  = SubClass()
someClass = nil
// Sub Class deinit
// Super Class deinit
```

deinit이 호출되고 난 후에 인스턴스가 해제 되므로 deinit에서는 인스턴스의 모든 프로퍼티에 접근할 수 있다

> ex) 닫아야 하는 파일명 조회

## Deinitialization의 사용

```swift
class Bank {
    static var coinsInBank = 10_000
    static func request(coins requestCoins: Int) -> Int {
        let availableCoins = min(coinsInBank, requestCoins)

        coinsInBank -= availableCoins
        return availableCoins
    }
    
    static func receive(coins: Int) {
        coinsInBank += coins
    }
}
```

coinsInBank : 저장 프로퍼티로 은행의 돈의 상태

request(coins:) : 은행에 돈을 요청하면 해당 금액을 반환

단, 요청한 금액이 은행이 가지고 있는 돈보다 많다면 은행이 가지고 있는 돈만 반환

receive(coins:) : 은행에 돈을 반납, 해당 돈은 coinsInBank에 저장

```swift
class Player {
    var coins: Int {
        didSet {
            print("player wins and coins : \(coins)")
            print("now Bank coins : \(Bank.coinsInBank)")
        }
    }
    init(coins: Int) {
        self.coins = Bank.request(coins: coins)
        print("joined Player has coin \(self.coins)")
    }
    
    func win(coins: Int) {
        self.coins += Bank.request(coins: coins)
    }
    
    deinit {
        Bank.receive(coins: coins)
        print("Player has left the game")
        print("Bank Has Coin : \(Bank.coinsInBank)")
    }    
}
```

coins : 게임을 할 플레이어의 돈

옵저버를 추가하여 돈이 변할 때 마다 플레이어의 돈과 은행의 돈의 상태를 출력

init(coins) : 초기 플레이어할 돈으로 인스턴스를 생성

win(coins) : 게임에서 이겼을 시 승리 수당을 은행으로 부터 받음

deinit : 플레이어가 게임을 떠날 시 (인스턴스 해제) 가지고 있는 돈을 은행에 반납

```swift
var player: Player?  = Player(coins: 100)
player?.win(coins: 2000)
player = nil

// joined Player has coin 100
// player wins and coins : 2100
// now Bank coins : 7900
// Player has left the game
// Bank Has Coin : 10000
```

플레이어는 100코인을 가진채 인스턴스가 생성됨 ( 플레이어 : 100, 은행 : 9900 )

> deinit 호출을 보기 위해 nil을 할당할 수 있게 옵셔널 타입으로 선언

player가 승리하여 2000코인을 은행으로 부터 받음 ( 플레이어 2100, 은행 : 7900 )

player가 퇴장 하여 은행에게 돈을 반납 ( 은행 : 10000)
