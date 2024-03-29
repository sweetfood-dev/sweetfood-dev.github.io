---
title: CollectionViewLayout
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

# UICollectionViewLayout
일반적인 collectionview의 delegate와 datasource는<br>
화면에 셀을 표시하는 역할을 담당합니다<br>
표시 할 때 구성과 같은 layout은 UICollectionViewLayout을 구현하여 처리해야합니다<br>
<br>
커스텀 CollectionViewLayout의 **주 역할**은 UICollectionView에서 요청하는 레이아웃 관련 정보를 제공하는 것입니다.<br>
레이아웃을 미리 준비해 놓았다가 UICollectionView에서 요청하면 준비한 레이아웃 정보를 제공합니다.<br>
이 때 몇가지 필수 메소드들이 존재합니다<br>
<br>
## prepare()
- UICollectionView에 표시되는 전체 크기를 계산하고 각 셀의 레이아웃 속성, collectionView의 크기와 cell의 위치를 미리 계산(캐싱)하여 메모리에 적재한 뒤 유지합니다.

## collectionViewContentSize
- collectionView의 전체 높이와 너비를 반환합니다.
- 화면에 보이는 contents 뿐만 아니라 collectionView의 전체를 반환해야 합니다.
- collectionView는 이 정보를 활용하여 내부적으로 scrollView의 크기를 구성합니다.

## layoutAttributesForElements (in :)
- in의 범위 안에 있는 모든 셀들의 레이아웃 속성들을 배열에 담아 반환합니다

## layoutAttributesForItem (at :)
- at으로 들어온 cell의 레이아웃 속성을 반환합니다.

## 호출 순서
Layout prepare() : 전체 크기, 셀의 위치를 미리 계산<br>
collectionView numberOfItemsInSection : 아이템의 전체 개수<br>
Layout collectionViewContentSize : collectionView의 전체 크기(너비, 높이)<br>
Layout layoutAttributesForElements : 범위 안에 있는 모든 셀들의 레이아웃 속성<br>
Layout collectionViewContentSize :  collectionView의 전체 크기(너비, 높이)<br>
collectionView cellForItemAt : cell 표시<br>
