---
title: Dictionary (사전)
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Collection
toc: true
toc_sticky: true
toc_label: 목차
---

# Dictionary란

사전은 순서가 지정되지 않은 **키와 값으로 구성된 쌍의 모음**이다

키는 중복되지 않고 고유하지만 각기 다른 키는 같은 값을 가리킬 수 있다. 

모든 키는 같은 Type이어야 하고, 모든 값도 같은 Type이어야 한다.

> 키와 값은 서로 같은 Type일 필요는 없다 !

![](/assets/images/Posts/Swift/2021-07-27-Dictionary/dictionary.png)

좌측의 Key는 모두 String type, 우측의 값은 모두 Int Type

key들은 모두 서로 다른 값이지만 Anna, Brian이 가지는 값을 보면 알 수 있듯이 값은 같을 수 있다.

## Array와의 차이점?

Array는 인덱스로만 값에 접근할 수 있으며, 해당 인덱스는 정수여야만 한다. 또한 Array에서 모든 인덱스는 순차적이다.

반면에 Dictionary에서 Key를 가지고 값에 접근할 수 있으며, Key는 정수를 포함한 모든 Type이 될 수 있다. 특정한 순서가 없다.

> 모든 Type이 Key가 가능하다고 하지만 조건이 있다. 바로 Key로 사용할 Type이 **Hashable 프로토콜**을 따라야 한다는 것인데, 기본적으로 Int, String, Double같은 기본 타입은 해당 프로토콜을 이미 따르고 있지만 내가 정의한 Type의 경우 Hashable 프로토콜을 채택해야한다. 추후 Protocol 정리에서 해당내용을 다룰 수 있을 것 같다!

## Dictionary 생성

### 리터럴 사용

대괄호로 묶인 쉼표로 구분된 키 - 값 쌍의 목록을 사용한다.

역시나 말은 어려우니 코드로 보자!

```swift
var namesAndScores = ["Anna" : 2, "Brian": 2, "Craig": 8, "Donna" : 6 ]
```

이 코드에서 Key의 Type은 String, Value의 Type은 Int이고 따라서,

 namesAndScores의 Type은 [String: Int] 이다.

### 빈 Dictionary

```swift
var pairs: [String: Int] = [:] // 타입 추론이 
var pairs2 = [String: Int]()
```

컴파일러는 빈 Dictionary 리터럴에서 유형추론을 할수 없으므로 Type을 명시하여 사용하거나

2번째 라인 처럼 이니셜라이저로 생성해줘야 한다 !

## 값 접근

### Key 접근

Array와 유사한데 Array에서는 인덱스를 사용하지만 Dictionary에서는 Key로 접근한다

```swift
var namesAndScores = ["Anna" : 2, "Brian": 2, "Craig": 8, "Donna" : 6 ]
print("Anna Score : \(namesAndScores["Anna"]!)") // output >> 2
```

Key로 접근할 때 Key에 대한 값이 있는지 확인을 하고 없으면 nil을 반환해야하기 때문에 반환 Type은 옵셔널이다. 

```swift
var namesAndScores = ["Anna" : 2, "Brian": 2, "Craig": 8, "Donna" : 6 ]
namesAndScores["jisoo"] // nil
```

## Property & Method

Array와 Dictionary는 Collection Protocol을 따릅니다

> Protocol은 추후에 다시 학습해봅시다.

이 Collection 프로토콜을 따르기 떄문에 많은 프로퍼티와 메소드를 공유합니다. 

자주 사용하는 isEmpty, count 또한 이 Collection 프로토콜에서 제공하는 프로퍼티입니다.

```swift
var namesAndScores = ["Anna" : 2, "Brian": 2, "Craig": 8, "Donna" : 6 ]
namesAndScores.isEmpty // 텅 비어있는가? -> false
namesAndScores.count // Key - Value가 몇 쌍 있어? -> 4
```

## Dictionary 수정

사전을 만들고 그 사전에 접근하여 값을 가져오는 것까지 해봤습니다. 그렇다면 수정을 하는 것은 어떨까요?

```swift
var namesAndScores = ["Anna" : 2, "Brian": 2, "Craig": 8, "Donna" : 6 ]
// sweetfood의 Key가 있다면 해당 값을 5로 수정, 없다면 5로 ! 
namesAndScores["sweetfood"] = 5 
//위와 동일한 코드
namesAndScores.updateValue(3, forKey:"sweetfood")
```

첨자에 Key를 사용하여 값을 넣어도 되고 마지막 줄 처럼 메소드를 사용하여 값을 넣어도 된다. 

결과는 같지만 다른 점이 하나 있다. 첨자를 사용하는 경우에 원래 해당 Key에 값이 있었다면 그냥 덮어쓰기처럼 5로 변경이 되지만 마지막줄과 같이 메소드를 사용하면 기존에 있던 값을 옵셔널로 감싸서 반환하고 3으로 변경이 된다 

```swift
namesAndScores["sweetfood"] = 5
let returnValue = namesAndScores.updateValue(3, forKey:"sweetfood")
// returnValue = 5, namesAndScores["sweetfood"] = 3
```

만약 이전 값이 없다면? 반환 값이 옵셔널 타입이기 떄문에 nil이 반환된다!

```swift
var mDic = [String: Int]()
let returnValue = mDic.updateValue(3, forKey: "sweetfood")
// returnValue = nil, mDic["sweetfood"] = 3
```

## Dictionary 삭제

수정과 마찬가지로 첨자를 사용한 방법, 메소드를 사용한 방법이 있다 !

값 접근 예시에서 설명할 때 Key에 대한 값이 없으면 nil을 반환한다고 했었다!. 첨자를 사용할 땐 해당 Key값에  nil을 넣어주면 된다!

메소드를 사용할땐 removeValue(forKey:) 메소드를 사용한다!

```swift
namesAndScores["sweetfood"] = nil
namesAndScores.removeValue(forKey: "sweetfood")
```

removeValue함수를 사용하여 삭제를 할 경우 삭제한 값이 반환된다.

> 주의해야할 점이 하나 있다. 만약 Dictionary의 타입이 [String: Int?] 처럼 옵셔널 타입을 값으로 사용할 때 첨자를 사용하여 삭제를 하려고 namesAndScores["sweetfood"] = nil 을 사용한다면 이는 키까지 완전히 제거하기 때문에 키를 유지하고 값만 nil로 변경하길 바란다면 updateValue메소드를 사용해야한다.

## Dictionary 순회

Array처럼 for문을 사용하여 순회할 수 있다. Dictionary의 Elements는 키 - 값 쌍으로 이루어 지기 때문에 튜플을 사용한다.

```swift
for (name, score) in namesAndScores {
    print("name: \(name) score: \(score)")
}
```

만약 Key나 Value 하나에 대해서만 순회를 하고 싶다면 keys, values를 통해 단일 항목에대해서 순회도 가능하다

```swift
// Key만 순회
for key in namesAndScores.keys {
    print("key \(key)")
}
// Value만 순회
for value in namesAndScores.values{
    print("value \(value)")
}
```
