---
title: 옵셔널 체이닝 (Optional Chaining)
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

# 옵셔널 체이닝 (Optional Chaining)

옵셔널 체이닝은 **nil**일 수도 있는 **프로퍼티**나 **메소드**, **서브스크립트**에 **질의**를 하는 과정을 말한다.

기본 동작은 옵셔널과 마찬가지고 값이 있으면 값을 반환, 값이 없다면 nil을 반환한다. 여러 **질의**를 연결할 수도 있는데 연결된 질의에서 어느 하나라도 nil이면 전체 결과는 nil이 된다.

```swift
// query1, query2 중 하나라도 값이 nil이라면 result는 nil이 된다
let result = query1?.query2?.query3 
```

## 강제 언래핑의 대체로써의 옵셔널 체이닝

위 코드에서 보이듯 옵셔널 체이닝은 옵셔널 값 뒤에 물음표(?)를 붙여서 표현한다. 강제 언래핑을 했는데 만약 그값이 없으면(nil 반환) 런타임 에러가 발생하지만, 옵셔널 체이닝을 사용하면 런타임 에러대신 nil이 반환된다.

옵셔널 체이닝에 의해 nil 값이 호출 될 수 있기 때문에 옵셔널 체이닝을 사용한 구문의 값은 항상 옵셔널이 된다.

코드를 보면서 이해해보자 

```swift
class Person {
	var residence: Residence?
}

class Residence {
	var numberOfRooms = 1
}
```

Residence는 Int 프로퍼티(numberOfRooms)를 소유하고 있고 Person은 옵셔널 프로퍼티(residence)를 소유하고 있다.

```swift
let john = Person()
```

john은 Person 인스턴스이고 이 시점에서 john의 residence는 nil로 초기화 되어있을 것이다.

근데 이 때 강제 언래핑을 사용한다면?

```swift
let roomCount = john.residence!.numberOfRooms // runtime error
```

당연하게도 런타임 에러가 발생할 것이다.

이를 옵셔널 체이닝으로 한다면 보다 안전하게 접근할 수 있다

```swift
if let roomCount = john.residence?.numberOfRooms { // 옵셔널 바인딩! 
	// 옵셔널 바인딩으로 인해 일반 프로퍼티처럼 사용 가능
	print("John residence \(roomCount) room(s)")  
} else { // nil 일 떄 
	print("residence == nil")
}
```

numberOfRooms는 옵셔널이 아닌데 어째서 옵셔널 바인딩을 사용했나?

앞에서 설명하였듯이 옵셔널 체인으로 접근하는 프로퍼티, 메소드등의 결과는 항상 옵셔널 값이 되기 때문에 이렇게 옵셔널을 벗겨줘야한다.
