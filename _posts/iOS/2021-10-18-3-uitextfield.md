---
title: "[iOS] UITextField"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- UITextField
toc: true
toc_sticky: true
toc_label: 목차
---
## 메소드

```swift
// 첫 번째 리스폰더로 설정 ( 자동으로 키보드 올라옴 ) 
textField.becomeFirstResponder()
// .edigingDidEndOnExit : 키보드에서 return / done같은 엔터키를 눌렀을 때 발생하는 이벤트
textField.addTarget(self, action: #selector(addItemDone(_:)), for: .editingDidEndOnExit)
```

```swift
/// 텍스트 필드의 텍스트가 변경될 때 마다 호출 되는 델리게이트 메소드
/// 새로운 텍스트를 알려주는게 아닌, 변경해야 하는 범위(range)와 교체해야하는 텍스트(string)만을 제공함
/// - Parameters:
///   - textField: 변경된 텍스트 필드
///   - range: 변경해야할 범위
///   - string: 교체해야하는 텍스트
/// - Returns: 불리언
func textField(_ textField: UITextField,
               shouldChangeCharactersIn range: NSRange,
               replacementString string: String) -> Bool {
    let oldText = textField.text!
    let stringRange = Range(range, in: oldText)!
    let newText = oldText.replacingCharacters(
        in: stringRange,
        with: string)
	
    doneBarButton.isEnabled = !newText.isEmpty
	
    return true
}
```

```swift
// 텍스트 필드의 모두 지우기 버튼을 활성화한 상태에서 x 버튼을 눌렀을 때 호출 되는 
// 델리게이트 메소드
func textFieldShouldClear(_ textField: UITextField) -> Bool {
    doneBarButton.isEnabled = false
    return true
}
```

## 프로퍼티

```swift
// true : 텍스트 필드가 비어있으면 엔터키를 비활성화
textField.enablesReturnKeyAutomatically = true
```
