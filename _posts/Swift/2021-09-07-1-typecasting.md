---
title: "[Swift] 타입 캐스팅 (Type Casting)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Type casting
toc: true
toc_sticky: true
toc_label: 목차
---

타입 캐스팅은 인스턴스의 타입을 **확인**하거나 같은 계층의 superclass, subclass로 **취급하는 방법**

여기서 계층은 상속관계를 말하는 것 같음

a, b, c 클래스가 있을 때 b -> a를 상속, c -> b를 상속이면 a,b,c는 동일한 계층에 있다

Swift의 타입 캐스팅은 as와 is 연산자를 사용

이 두 연산자는 값의 **타입을 확인(is)**하거나 **다른 타입으로 캐스팅할 수 있는 방법(as)**을 제공

타입 캐스팅을 사용하면 특정 **프로토콜**을 채택했는지도 확인할 수 있음

## 타입 캐스팅을 위한 클래스 계층 정의

동일한 계층에 속해야 superclass나 subclass로 캐스팅이 가능

```swift
class MediaItem {
    var name: String 
    init(name: String) {
        self.name = name
    }
}
```

String 타입의 name 변수와 name을 초기화하는 이니셜라이저를 가지는 MediaItem 타입 클래스를 정의

MediaItem을 상속받는 2가지 클래스를 정의

```swift
class Movie: MediaItem {
    var director: String
    init(name: String, director: String) {
        self.director = director
        super.init(name: name)
    }
}

class Song: MediaItem {
    var artist: String
    init(name: String, artist: String) {
        self.artist = artist
        super.init(name: name)
    }
}
```

Movie와 Song을 아이템으로 가질 수 있는 배열 library을 선언

```swift
let library = [
    Movie(name: "Casablanca", director: "Michael Curtiz"),
    Song(name: "Blue Suede Shoes", artist: "Elvis Presley"),
    Movie(name: "Citizen Kane", director: "Orson Welles"),
    Song(name: "The One And Only", artist: "Chesney Hawkes"),
    Song(name: "Never Gonna Give You Up", artist: "Rick Astley")
]
```

Swift는 library가 가지고 있는 Movie, Song의 **공통 부모인 MediaItem으로 타입추론**하여

library는 [Mediaitem] 타입이됨

따라서 library를 순회하면 Movie, Song이 아닌 MediaItem타입으로 아이템을 받음

원래 타입으로 사용하기 위해서는 타입을 확인하거나 다른 유형으로 다운캐스팅 해야함

![typecasting.png](/assets/images/Posts/Swift/2021-09-07/TypeCasting/typecasting.png)

## 타입 확인

**is** 연산자를 사용하여 **인스턴스의 타입을 확인**할 수 있음

타입 확인 연산자인 is는 인스턴스가 해당 인스턴스의 하위클래스의 타입인경우 **true**, 

그렇지 않으면 **false**를 return

```swift
let song = Song(name:....)
let movie = Movie(name: ...)

if song is Movie {
}
```

위의 경우 Song과 Movie가 superclass가 같지만 Movie클래스가 song의 subclass가 아님

```swift
var movieCount = 0
var songCount = 0
library.forEach {
    if $0 is Movie { movieCount += 1}
    else if $0 is Song { songCount += 1}
}
print("movie : \(movieCount) song : \(songCount)" )
// movie : 2 song : 3
```

## 다운 캐스팅

특정 클래스 타입의 상수 또는 변수는 서브 클래스의 인스턴스를 참조할 수 있음

이러한 경우 타입 캐스팅 연산자(? 또는 !)를 사용하여 서브클래스 타입으로 다운캐스트할 수 있음

> 위 코드를 예로 들면 library는 MediaItem 타입을 가지는 배열이지만
실제로 참조하는건 Movie, Song 타입이다.

다운캐스팅은 실패할 수 있기 때문에 타입 캐스트 연산자는 **as?**와 **as!** 두 가지를 제공.

**as?**는 다운캐스트하려는 타입의 옵셔널 값을 반환.

**as!**는 다운캐스트를 시도하고 강제 언래핑을 함.

다운 캐스팅이 성공할지 확신할 수 없는 경우 타입 캐스팅 연산자 **as?** 사용.

항상 선택적 값을 반환하며 다운 캐스팅이 불가하면 nil을 반환. 

다운캐스팅이 항상 성공할 것이라고 확신하는 경우에만 형식 캐스팅 연산자 **as!** 강제 형식을 사용.

잘못된 클래스 유형으로 다운 캐스팅을 시도하면 **런타임 오류를 트리거**함

```swift
for item in library {
    if let movie = item as? Movie {
        print("Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("Song: \(song.name), by \(song.artist)")
    }
}
```

library의 item은 Movie, Song 두 타입일 수 있기 때문에 as? 연산자를 사용하여 순회시 매번 확인하는게 적절

옵셔널 바인딩이 성공하였으면 해당 타입의 인스턴스로 사용가능하여 프로퍼티에 접근이 가능하다.

> 타입 캐스팅은 인스턴스의 값을 수정하거나 변경하지 않는다.
인스턴스는 그대로 유지되며 타입 캐스팅한 타입의 인스턴스처럼 취급을 할뿐이다.

### Any, AnyObject의 타입 캐스팅

Swift는 2가지의 특수한 타입을 제공한다

1. Any : 함수, 클로저등을 **모든 타입**을 대표할 수 있다
2. AnyObject: **모든 클래스 타입**을 대표할 수 있다 

```swift
var things = [Any]()

things.append(0)
things.append(0.0)
things.append(42)
things.append(3.14159)
things.append("hello")
things.append((3.0, 5.0))
things.append(Movie(name: "Ghostbusters", director: "Ivan Reitman"))
things.append({ (name: String) -> String in "Hello, \(name)" })
```

Any타입의 배열 things는 보다 시피 Int, Double, String, Struct등 여러 타입을 가질 수 있다.

해당 아이템들은 switch 안에서 is, as를 사용하여 바인딩하여 적절하게 활용 가능하다

```swift
for thing in things {
    switch thing {
    case 0 as Int:
        print("zero as an Int")
    case 0 as Double:
        print("zero as a Double")
    case let someInt as Int:
        print("an integer value of \(someInt)")
    case let someDouble as Double where someDouble > 0:
        print("a positive double value of \(someDouble)")
    case is Double:
        print("some other double value that I don't want to print")
    case let someString as String:
        print("a string value of \"\(someString)\"")
    case let (x, y) as (Double, Double):
        print("an (x, y) point at \(x), \(y)")
    case let movie as Movie:
        print("a movie called \(movie.name), dir. \(movie.director)")
    case let stringConverter as (String) -> String:
        print(stringConverter("Michael"))
    default:
        print("something else")
    }
}
```
