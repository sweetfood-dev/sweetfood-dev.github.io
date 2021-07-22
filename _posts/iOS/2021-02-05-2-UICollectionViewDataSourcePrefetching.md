---
title: UICollectionViewDataSourcePrefetching
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
popular: true
toc: true
toc_sticky: true
toc_label: 목차
categories:
- iOS
tag:
- UICollectionView
---

UITableView/UICollectionView 에서 Pagenation을 위해 보통 아래 방법을 사용했다.<br>

```swift
func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if indexPath.row == myItemList.count - 1 {
            fetchNextPage()
        }
    }
```
<br>
보여지는 Cell을 기준으로 List 의 마지막 아이템을 부르기 전에 다음 리스트 호출을 하는 식이다.<br>
하지만 이번에 과제를 하면서 너무 버벅여 다른 방법을 찾아봤는데, UICollectionViewDataSourcePrefetching 프로토콜이 존재하였다<br>
'willDisplay' 이 실제 보여지는 Cell을 기준으로 한다면 prefetchDataSource 는 이 작업을 백그라운드로 옮겨와 처리하는 것이다.<br>

```swift
extension ViewController: UICollectionViewDataSourcePrefetching {
    func collectionView(_ collectionView: UICollectionView, prefetchItemsAt indexPaths: [IndexPath]) {
		//내용 
    }
}
```

이렇게 수정 후 눈에 띄게 속도가 향상되었다!!!
