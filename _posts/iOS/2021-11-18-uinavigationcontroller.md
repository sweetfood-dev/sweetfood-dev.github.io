---
title: "[iOS] UINavigationViewController"
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
- UIKit
toc: true
toc_sticky: true
toc_label: 목차
---

## 개요

네비게이션 뷰 컨트롤러는 1개 이상의 자식 뷰 컨트롤러를 관리하는 컨테이너 뷰 컨트롤러

여러 자식 뷰 컨트롤러를 가질 수는 있지만 눈으로 볼 수 있는 자식은 1개 뿐이다.

root 뷰 컨트롤러를 제외한 모든 자식 뷰 컨트롤러에서 계층 구조의 위로 다시 이동할 수 있도록 Back 버튼을 제공

![계층구조.png](/assets/images/Posts/iOS/2021-11-18-uinavigationcontroller/계층구조.png)

위 그림을 보면 Settings가 root 뷰 컨트롤러이고

General, Auto-Look ViewController로 계층적으로 이동한 것을 볼 수 있음. root 뷰 컨트롤러가 아닌

자식 뷰 컨트롤러에 각각 왼쪽 상단에 이전으로 돌아가는 Back 버튼이 존재

## 구성 요소

![스크린샷 2021-11-18 오후 2.13.30.png](/assets/images/Posts/iOS/2021-11-18-uinavigationcontroller/구성요소.png)

### 스택

navigation viewcontroller는 navigation stack이라 불리는 정렬된 배열을 사용해

자식 viewcontroller를 관리함

배열의 첫 번째 ( [0] ) viewcontroller는 navigation viewcontroller의 root viewcontroller이며 

stack의 최하단을 나타냄

배열의 마지막 viewcontroller는 최상위 항목이며 현재 화면에 표시되는 viewcontroller를 나타냄

segue나 navigation viewcontroller의 메소드를 사용해 vc를 스택에 추가 및 제거할 수 있음

즉, 보통 사용하는 pushViewController는 navigation stack에 추가를 하는 메소드이며

추가를 하게 되면 스택의 최상단에 위치하므로 push하는 viewcontroller가 화면에 나타나고

popViewController는 스택에서 해당 viewcontroller를 제거하고 

스택의 최상단에 위치하는 viewcontroller를 화면에 보여줌

### Navigation Bar

navigation viewcontroller는 상단의 navigation bar와 하단의 optional한 toolbar를 관리함

navigation bar는 toolbar와 달리 항상 존재함

navigation viewcontroller는 최상위 자식 viewcontroller가 제공하는 설정관련 컨텐츠를 사용하여 

navigation bar를 구성함

### Navigation Toolbar

isToolbar 프로퍼티 값이 false인 경우 하단에 위치한 toolbar가 나타남

navigation bar와 마찬가지로 최상위 자식 viewcontroller가 제공하는 컨테츠로 toolbar를 구성함

### Delegate

viewcontroller의 push, pop을 재정의하여 애니메이션, navigation 인터페이스의 기본 방향을 재정의

push, pop될 때의 동작을 수정하려면 UINavigationControllerDelegate 프로토콜을 구현하여

delegate 프로퍼티로 전달

## 사용

스토리보드가 아닌 코드로 진행을 하기 위해 Main.storyboard를 지우고

SceneDelegate.swift에 다음과 같이 코드를 넣어줌

[SceneDelegate.swift]

```swift
func scene(_ scene: UIScene, willConnectTo session: UISceneSession,
               options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = (scene as? UIWindowScene) else { return }

    window = UIWindow(windowScene: windowScene)

    let mainViewController = ViewController()
    // NavigationController 생성, 초기화로 rootViewController사용
    let navigationController = UINavigationController(rootViewController: mainViewController)
    // window의 rootViewController로 navigationController 설정
    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()
    }
```

총 3개의 ViewController를 사용할 것 이며 각 ViewController는 

현재 ViewController의 이름을 나타내는 UILabel 1개와

다음 ViewController를 navigation controller에 push하는 UIButton 1개를 가지게 할 것이기에

중복되는 코드를 최소한으로 하기 위해 protocol을 선언하고 거기에 기본 구현도 작업

Navigationable.swift

```swift
import UIKit
import SnapKit

protocol Navigationable {
    // 정중앙에 표시될 label
    var label: UILabel { get }
    // navigation controller에 push 하기 위한 버튼
    var moveButton: UIButton { get }
    // label과 moveButton의 오토레이아웃 적용
    func setAutoLayout()
}
ㄴ
// UIViewController 타입일 때만 확장
extension Navigationable where Self: UIViewController{
    func setAutoLayout() {
        view.addSubview(label)
        label.snp.makeConstraints { make in
            make.center.equalTo(view)
        }

        view.addSubview(moveButton)
        moveButton.snp.makeConstraints { make in
            make.centerX.equalTo(view)
            make.top.equalTo(label.snp.bottom).offset(10)
            make.width.equalTo(80)
            make.height.equalTo(50)
        }
    }
}
```

기본적인 준비가 끝났으니

UIViewController를 3개 만들고 각각 Navigational 프로토콜을 채택하여 label, moveButton을 생성해주고

moveButton에 addTarget 메소드를 사용해 push를 해보자

[ViewController.swift]

```swift
@objc func pushAction() {
    let secondVC = SecondViewController()
    navigationController?.pushViewController(secondVC, animated: true)
}
```

[SecondViewController.swift]

```swift
@objc func pushAction() {
    let destination = ThirdViewController()
    navigationController?.pushViewController(destination, animated: true)
}
```

![MainViewController.png](/assets/images/Posts/iOS/2021-11-18-uinavigationcontroller/MainViewController.png)

![SecondViewController.png](/assets/images/Posts/iOS/2021-11-18-uinavigationcontroller//SecondViewController.png)

![ThirdViewController.png](/assets/images/Posts/iOS/2021-11-18-uinavigationcontroller//ThirdViewController.png)

맨 마지막 ThirdViewController에는 2가지 버튼을 더 추가함 

ViewController, SecondViewController에는 모두 title 프로퍼티에 값을 설정해주었지만

ThirdViewController에는 title 프로퍼티에 값을 설정하지 않았음

title 프로퍼티의 값 할당 여부에 따라 navigation bar의 형태가 달라짐

1. 기본적으로 이전 ViewController의 title이 있다면 그 title 값이 뒤로가기 버튼의 이름이 되지만
    
    너무 길다면 Back이라는 값으로 대체됨
    
2. 이전 ViewController의 title이 없다면 버튼의 이름은 Back으로 할당됨

각 moveButton은 모두 pushViewController를 하게 되고 그 매개변수로 

스택에 넣을 ViewController를 전달함.

전달받은 ViewController를 navigationStack에 넣게 되면

넣은 ViewController가 최상위 아이템이 되기 때문에 해당 ViewController를 화면에 나타냄

반대로 navigation bar의 왼쪽에 있는 back버튼을 누르면 pop이 되기 때문에 

navigationStack에서 현재 보고 있는 ViewController가 삭제되고 그 이전 ViewController가

최상위 아이템이기 때문에 이전 ViewController가 화면에 나타나게 됨

navigation bar의 뒤로가기 버튼말고 다른 버튼에서도 이러한 동작을 할 수 있게 할 수 있음

마지막 ThirdViewController의 버튼을 살펴보자

```swift
var moveButton: UIButton = {
    let button = UIButton()
    button.setTitle("Back", for: .normal)
    button.setTitleColor(.black, for: .normal)
    button.layer.cornerRadius = 20
    button.layer.borderWidth = 2

    button.addTarget(self, action: #selector(popAction), for: .touchUpInside)
    return button
}()
```

return 하기 바로 전 라인을 보면

popAction을 바인딩 시켜주었다. popAction의 내용은 간단하다

```swift
@objc func popAction() {
    navigationController?.popViewController(animated: true)
}
```

단순히 navigationController의 popViewController를 호출해주고 있다.

이 메소드를 호출하면 navigation stack에서 최상위 아이템을 pop하는데

현재 이 버튼을 가지고 있는 ThirdViewController가 최상위 아이템인데 pop을 하기 때문에

이전 아이템인 SecondViewController가 스택의 최상위 아이템이 되고 화면에 표시되게 된다

바로 뒤로만 이동할 수 있는 것은 아니다

원하는 viewcontroller가 나올때 까지 navigation stack을 pop하여 해당 viewcontroller까지

이동할 수 있다

```swift
@objc func popToViewControllerAction() {
    guard let viewControllerStack = navigationController?.viewControllers else { return }
	
    viewControllerStack.forEach { viewController in
        if let destination = viewController as? SecondViewController {
            navigationController?.popToViewController(destination, animated: true)
        }
    }
}
```

popToViewController 메소드를 호출하면 매개변수로 전달한 ViewController를 만나기까지 계속

pop 작업을 하기 때문에 해당 ViewController까지 이동할 수 있다.

주의할 점은 전달할 ViewController 인스턴스는 navigation stack에 존재하는 인스턴스여야 함

바로 root viewcontroller까지 이동할 수도 있다.

```swift
@objc func directRootAction() {
	navigationController?.popToRootViewController(animated: true)
}
```

popToRootViewController 메소드를 호출하면 root viewcontroller를 제외한 모든 스택을 pop시키는 것

같다

## 참고

[Apple](https://developer.apple.com/documentation/uikit/uinavigationcontroller)

## 코드

[Github](https://github.com/sweetfood-dev/iOSTutorialProject/tree/main/NavigationTutorial)
