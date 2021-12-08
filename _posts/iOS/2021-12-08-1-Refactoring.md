---
title: "[iOS] 오늘의 리팩토링"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Refactoring History
toc: true
toc_sticky: true
toc_label: 목차
---

### 중복된 메소드 호출1 

`updateValue(channel:,type:)` 메소드의 호출이 `didSelectItemAt`과 `updateModelData` 모두에서 사용되어 `updateModelData`를 호출하는 것으로 변경

**변경전**
```
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    tcLevelGroupdInstance.updateValue(channel: indexPath.row, type: .isSelected) {
        collectionView.reloadData()
    }
}

extension TCSetViewController: UpdatableDataDelegate {
    func updateModelData<ItemType>(channel: Int, valueType: ItemType) {
        guard let type = valueType as? ValueType else { return }
        switch type {
        case .tLevel(_),.cLevel(_),.prove(_), .selectThumb(_), .unSelected:
            tcLevelGroupdInstance.updateValue(channel: channel, type: type)
        case .isSelected:
            self.tcLevelGroupdInstance.updateValue(channel: channel, type: type) { [weak self] in
                self?.collectionView.reloadData()
            }
        case  .availableChannel:
            tcLevelGroupdInstance.updateValue(channel: channel, type: type){ [weak self] in
                self?.collectionView.reloadData()
            }
        }
    }
}
```
**변경후**
```
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    updateModelData(channel: indexPath.row, valueType: ValueType.isSelected)
}
```

### 중복된 메소드 호출2

`updateModelData` 에서 `case .isSelected` 와 `case .availableChannel`이 같은 코드를 사용하므로 하나로 묶음

```
extension TCSetViewController: UpdatableDataDelegate {
    func updateModelData<ItemType>(channel: Int, valueType: ItemType) {
        guard let type = valueType as? ValueType else { return }
        switch type {
        case .tLevel(_),.cLevel(_),.prove(_), .selectThumb(_), .unSelected:
            tcLevelGroupdInstance.updateValue(channel: channel, type: type)
        case .isSelected, .availableChannel:
            tcLevelGroupdInstance.updateValue(channel: channel, type: type) { [weak self] in
                self?.collectionView.reloadData()
            }
        }
    }
}
```

### 중복된 프로퍼티 사용

`didSelectItemAt`에 메소드 호출을 추가하였는데 무심결에 `indexPath.row`를 똑같이 2번 사용함
그래서 `let channel` 상수를 사용하여 타이핑을 최소화?하고 좀더 이뻐보이게 변경

**변경전**  

```
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {    
    updateModelData(channel: indexPath.row, valueType: ValueType.isSelected)
    updateModelData(channel: indexPath.row, valueType: ValueType.selectThumb(thumb: 0))
}
```

**변경후**

```
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    let channel = indexPath.row
    updateModelData(channel: channel, valueType: ValueType.isSelected)
    updateModelData(channel: channel, valueType: ValueType.selectThumb(thumb: 0))
}
```

`updateModelData`의 인자타입을 배열로 변경해서 
```
updateModelData(channel: channel, valueType: [ValueType.isSelected,
                                                ValueType.selectThumb(thumb: 0)])
```
이렇게 합처버릴까도 생각해봤지만, 그래도 개인적으로는 2줄을 나란히 작성하는게 
더 눈에 익어서 수정은 추후에 다시 생각해 보기로 함
