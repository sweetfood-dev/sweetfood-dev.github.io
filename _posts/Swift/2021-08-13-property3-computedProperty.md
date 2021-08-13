---
title: "[Swift] 연산 프로퍼티 (Computed properties)"
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
## 연산 프로퍼티란?

클래스, 구조체, 열거형에서 사용할 수 있는 연산 프로퍼티는 **값을 저장하지 않는 프로퍼티**로써

값을 저장하지 않기 때문에 다른 프로퍼티를 **"간접적"으로 사용**하여 값을 검색, 반환 할 수 있는 **getter**와 

값을 설정하는 **setter**를 제공합니다. 

```swift
struct Student {
    var _name = "Sweet food"
    var name: String {
        get { return _name }
        set(newName) { _name = newName }
    }
}

var person = Student()
print(person.name)
person.name = "dev"
print(person.name)
```

위 코드를 보면 연산 프로퍼티 name은 저장 프로퍼티 _name을 간접적으로 사용하여 반환하는 get과 값을 설정하는 set이 있습니다!.

연산 프로퍼티는 할당 연산자인 = 를 사용하는 대신, 중괄호를 사용하여 프로퍼티의 계산 (get / set)을 묶어 줍니다.

연산 프로퍼티의 경우 **프로퍼티의 타입**을 꼭 **명시**해주어야 합니다! 타입추론이 안되는거 같네요 ㅠ 이부분은 추가로 알아봐야 겠습니다!

> 값을 저장하는 프로퍼티가 아니기 때문에 타입추론이 안된다 하는데, 이를 유추해보면 값을 저장할 수 있다는건 메모리를 사용한다는 것이니 메모리를 사용할 때만 타입 추론을 할 수 있는 것 같습니다?

또한 연산 프로퍼티는 **상수(let)으로 사용할 수 없답니다!** 값을 반환할 때 항상 같은 값을 반환한다는 것을

보장할 수 없기 때문입니다. 

## setter

set이 바로 setter입니다. 

이 setter는 필수가 아닌 **선택사항**이기에 연산 프로퍼티를 사용할 때 생략할 수 있답니다!

또한 위의 예제에서 set(newName)으로 파라미터명을 명시하였는데 이는 생략 가능하며 생략 하였을 때 **newValue**로 접근할 수 있습니다!

```swift
struct Student {
    var _name = "Sweet food"
    var name: String {
        get { return _name }
        set { _name = newValue } // newName 파라미터 생략 후 newValue로 접근
    }
}

var person = Student()
print(person.name)
person.name = "dev"
print(person.name)
```

## getter

getter는 연산 프로퍼티에서 **필수**로 사용해야 합니다!

getter에서는 값을 반환하는 데 이때 반환 되는 형식이 단일 표현식 이라면 당연하게 return문도 생략 가능합니다

```swift
struct Student {
    var _name = "Sweet food"
    var name: String {
        get { _name }
        set { _name = newValue } // newName 파라미터 생략 후 newValue로 접근
    }
}
```

### 읽기 전용 연산 프로퍼티

getter는 필수로 사용해야 하지만 setter는 선택이라고 말씀드렸는데요.

그럼 getter밖에 없는 경우도 있겠죠? 이렇게 반환만 가능하고 값 설정을 못하는 연산프로퍼티를

읽기 전용 연산 프로퍼티라고 합니다. 읽기 전용인 경우 **get 키워드와 함께 중괄호를 생략 할 수 있습니다!**

```swift
struct Student {
    var _name = "Sweet food"
    // 읽기 전용 프로퍼티는 get { } 을 생략 할 수 있다.
    var name: String { _name } // return 까지 생략 해버릴 수 있다
}
```

## 정리

1. 클래스, 구조체, 열거형에서 사용가능하다
2. 연산 프로퍼티는 var로 선언해야 한다.
3. 연산 프로퍼티는 값을 저장하지 않기 때문에 타입을 명시 해줘야 한다
4. setter는 파라미터명을 주고 사용할 수도 있고 생략하고 newValue로 사용 가능하다.
5. getter만 있는 것을 읽기 전용 연산 프로퍼티라고 하며 get { }도 생략 가능하다
