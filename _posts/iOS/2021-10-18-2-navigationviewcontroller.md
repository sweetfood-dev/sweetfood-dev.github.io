---
title: "[iOS] NavigationController"
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
toc: true
toc_sticky: true
toc_label: 목차
---

네비게이션 뷰 컨트롤러는 다른 뷰 컨트롤러의 컨테이너 역할을 하는 특수한 뷰 컨트롤러

다른 컨테이너 역할을 하는 뷰 컨트롤러로 탭 바 뷰컨트롤러가 존재함

## Segue type

1. Show : 
새 보기 컨트롤러가 탐색 스택의 맨 위에 있도록 새 보기 컨트롤러를 탐색 스택으로 푸시합니다. 또한 이전 뷰 컨트롤러로 돌아갈 수 있는 뒤로 버튼을 제공합니다. 뷰 컨트롤러가 탐색 컨트롤러에 포함되어 있지 않으면 새 뷰 컨트롤러가 모달로 표시됩니다. 이것이 의미하는 바는 아래 목록에서 모달로 표시를 참조하세요. 예: 메일 앱에서 폴더 탐색
2. Show Detail (Split View Controller에서 사용 ) :
새로운 뷰 컨트롤러는 확장된 2열 인터페이스에 있을 때 분할 뷰의 상세 뷰 컨트롤러를 대체합니다. 그렇지 않고 단일 열 모드인 경우 탐색 컨트롤러를 푸시합니다. 예: 메시지에서 대화를 탭하면 대화 세부 정보가 표시됩니다. 2열 레이아웃일 때 오른쪽의 보기 컨트롤러를 교체하고 단일 열 레이아웃일 때 대화를 푸시합니다.
3. Present Modally :
이전 뷰 컨트롤러를 덮기 위해 새로운 뷰 컨트롤러를 표시합니다. iPhone에서 전체 화면을 덮는 뷰 컨트롤러를 표시하는 데 가장 일반적으로 사용되거나 iPad에서는 프레젠테이션 뷰 컨트롤러를 어둡게 하는 가운데 상자로 표시하는 것이 일반적입니다. 일반적으로 상단에 탐색 모음이 있거나 하단에 탭 모음이 있는 경우 모달 뷰 컨트롤러에서도 해당 항목을 처리합니다. 예: 설정에서 터치 ID 및 암호 선택
4. Present as Popover :
iPad에서 실행하면 새 뷰 컨트롤러가 팝오버에 나타나고 이 Popover 외부의 아무 곳이나 탭하면 해제됩니다. iPhone에서는 전체 화면에 새로운 뷰 컨트롤러를 모달로 표시합니다. 예: 캘린더에서 + 버튼 누르기
5. Custom :
사용자 지정 segue를 구현하고 동작을 제어할 수 있습니다

## 프로퍼티

```swift
// Title 같은 아이템 단위의 항목에 대한 수정은 navigationItem을 통해,
// 그외에 title의 크기같은 UI 관련 설정은 navigatioBar를 통해 하는걸로 추측
// title 지정
navigationItem.title = "CheckList"
// 큰 제목으로 표시
navigationController?.navigationBar.prefersLargeTitles = true
// .append(_:)를 사용하면 추가가 안되는듯?
navigationItem.rightBarButtonItems = [addButton]
```

```swift
// title 지정
navigationItem.title = "Add Item"
// 큰 타이틀 모드 적용 안함
navigationItem.largeTitleDisplayMode = .never
```

## 메소드

```swift
/// 아이템을 추가하는 AddItemViewController로 이동
/// - Parameter sender: UIBarButton 인스턴스
@objc func moveNextViewController(_ sender: UIBarButtonItem){
    // 스토리보드의 AddItemViewController의 식별자로 불러옴
    guard let vc = storyboard?.instantiateViewController(withIdentifier: "AddItemViewController") as? AddItemViewController else { return }
    // 네비게이션 컨트롤러로 푸쉬
    navigationController?.pushViewController(vc, animated: true)
}
```

```swift
@objc func addItemDone(_ sender: UIBarButtonItem) {
    // 현재 화면을 닫고 이전 ViewController로 돌아감
    navigationController?.popViewController(animated: true)
}

@objc func cancelButton(_ sender: UIBarButtonItem) {
    // 현재 화면을 닫고 이전 ViewController로 돌아감
    navigationController?.popViewController(animated: true)
}
```

> `popViewController`를 실행하면 해당 뷰 컨트롤러가 화면에서 사라질뿐만 아니라 메모리에서도 해제가 됨
> 

## 네비게이션 아이템

```swift
lazy var addButton: UIBarButtonItem = {
    let button = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(moveNextViewController(_:)))
    return button
}()
```
