---
title: "[iOS] UINavigationBar / UINavigationItem"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- UINavigationController
- UINavigationBar
- UINavigationItem
- UIBarButtonItem
- UIKit
toc: true
toc_sticky: true
toc_label: 목차
---
개발할 때 언제 navigationBar를 사용해야하는지, navigationItem을 사용해야 하는지

너무너무 헷갈려서 정리함

## 개요

navigationController와 함께 화면 상단에 표시되는 막대 형태의 navigation controller이다.

기본 구성요소는 왼쪽버튼, 중앙의 제목, optional한 오른쪽 버튼

> 즉 navigationItem은 navigationBar의 구성요소이다!
> 

navigation controller는 navigationBar를 생성할 때 

현재 표시되고 있는 ViewController의 프로퍼티를 사용하는데

대표적인것이 title, navigationitem이 있다.

> title은 제목으로, navigationItem에 설정된 버튼들이 navigationBar로 구성되어지는 것 같음
> 

navigationBar는 navigationController의 프로퍼티로 접근가능하고

navigationItem은 각 ViewController의 프로퍼티로 접근이 가능함

navigationController는 navigationBar를 생성할 때

ViewController의 title, navigationItem 프로퍼티를 사용해 

navigationBar를 구성한다!

navigationItem은 왼쪽, 오른쪽, 중앙에 들어가는 UIBarIButtontem 타입의 프로퍼티들을 가지고 있다

## 실습

[Apple](https://developer.apple.com/documentation/uikit/uinavigationcontroller/customizing_your_app_s_navigation_bar)에서 제공해주는 SampleCode를 직접 만들어 보겠다

### MainViewController

![메인vc.png](/assets/images/Posts/iOS/2021-11-18-uinavigationbar/메인vc.png)

위와 같은 구성을 위해

`tableView` 와 `UIBarButtonItem`을 생성

```swift
private lazy var tableView: UITableView = {
	let tableView = UITableView()
	tableView.delegate = self
	tableView.dataSource = self
	tableView.estimatedRowHeight = UITableView.automaticDimension
	tableView.rowHeight = UITableView.automaticDimension
	return tableView
}()
```

```swift
let navLeftItem = UIBarButtonItem(title: "Style",
                                          style: .plain,
                                          target: self,
                                          action: #selector(showActionSheet))
navigationItem.leftBarButtonItem = navLeftItem
```

`navigationBar`를 구성할 때 `ViewController`의 `navigationItem` 프로퍼티를 읽어서 구성한다고 하였으니

`navigationBar`에 사용할 버튼류들은 `navigationBar`의 left / rightButtonItem에 적절히 넣어주면 됨

Style이라는 이름을 가지고 있는 `leftBarButtonItem`은 터치 했을 때

`actionSheet`가 출력된다. 그래서 action에 UIAlertViewController를 생성하여 보여주는showActionSheet 메서드를 넣어줌.

actionSheet의 내용은 3가지 버튼으로 이루어져 있음

![actionsheet.png](/assets/images/Posts/iOS/2021-11-18-uinavigationbar/actionsheet.png)

default, Black Opaque는 모두 navigationBar의 스타일을 변경함

다만 default는 현재 화면의 navigationBar의 스타일

Black Opaque는 까만 배경색을 가진 스타일을 가지도록 함

default 일 때는

```swift
self?.navigationController?.navigationBar.barStyle = .default
self?.navigationController?.navigationBar.isTranslucent = true
self?.navigationController?.navigationBar.titleTextAttributes = [.foregroundColor: UIColor.black]
```

Black Opaque일 때는 

```swift
self?.navigationController?.navigationBar.barStyle = .black
self?.navigationController?.navigationBar.isTranslucent = false
self?.navigationController?.navigationBar.titleTextAttributes = [.foregroundColor: UIColor.white]
```

코드가 각각 실행됨

`style`은 `navigationBar`의 `barStyle` 프로퍼티를 사용해 변경 가능함

값은 `.default`, `.black` 두 가지이다

`isTranslucent`는 반투명 여부를 결정하는 프로퍼티

각각 실행 해보면 아래와 같이 `navigationBar`의 스타일이 변경 된다

![메인vc.png](/assets/images/Posts/iOS/2021-11-18-uinavigationbar/메인vc.png)

![blackStyle.png](/assets/images/Posts/iOS/2021-11-18-uinavigationbar/blackStyle.png)

## 문제 및 해결

### backButtonTitle
```swift
let vc = UIViewController()
vc.navigationItem.backButtonTitle = "1"
```

vc의 backButtonTitle이 1이 되는게 아니라 

vc를 이전 화면으로 하는 ViewController의 backButtonTitle이 1로 설정됨.

예를 들어 navigationStack에 아래와같이 3개의 ViewController가 있다고 가정할 때 

vc2 - 윈도우에 display 최상위 ViewController 

vc

main

vc2에서 보이는 backButton의 title


## 코드

[Git](https://github.com/sweetfood-dev/iOSTutorialProject/tree/main/NavigationTutorial)
