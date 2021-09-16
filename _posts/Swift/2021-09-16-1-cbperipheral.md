---
title: "[iOS] CoreBluetooth - CBPeripheral"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- CoreBluetooth
toc: true
toc_sticky: true
toc_label: 목차
---

중앙관리자가 주변장치를 탐색하고 연결까지 하게 되면

주변장치 인스턴스를 사용해 서비스와 특성을 발견할 수 있다.

주변장치 인스턴스를 사용하기 때문에 CBPeripheral과 CBperipheralDelegate 프로퍼티와 메서드를 사용한다

## Discovering services

중앙관리자와 연결된 주변 장치(이하 주변 장치)는 **services**라는 **프로퍼티**를 가지고 있음

services의 타입은 **[CBService]? 타입**으로 해당 프로퍼티는 **초기에는 nil 값**을 가지고 있음

```swift
open class CBPeripheral : CBPeer {
    ...
    var services: [CBService]? { get }
    ...
}
```

주변장치의 **discoverServices(_:)** 메서드를 호출하여 서비스를 탐색할 수 있다

인자 값으로는 검색된 서비스를 제한하는 **[CBUUID]? 타입**을 받는다. 

전달된 UUID의 서비스만 탐색하게 된다. 옵셔널 타입이기 때문에 모든 서비스를 탐색하고 싶다면 nil값을 전달해도 된다.

```swift
private let targetUUID = CBUUID(string: "UUID")
// targetUUID와 일치하는 서비스만 검색
peripheral.discoverServices([targetUUID])
// 모든 서비스 검색
peripheral.discoverServices(nil)
```

서비스가 검색되면 **CBPeripheralDelegate** 프로토콜의

**peripheral(_:, didDiscoverServices:)** 메서드가 호출된다.

```swift
/// 서비스 탐색 메서드 호출 후 검색되면 호출되는 델리게이트 메서드
/// - Parameters:
///  - peripheral: 주변장치, 이 주변장치를 통해 발견된 서비스를 services 프로퍼티로 접근 가능
///  - error: 에러
func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?){}
```

이 메서드로 전달된 peripheral 객체의 services 프로퍼티에는 검색된 서비스들이 포함되어 있다

```swift
guard let services = peripheral.services else { return }
for service in services {
    print(service)
}
```

## Discovering characteristics

특성은 서비스의 아래에 그룹화되어 존재한다

따라서 위 단계에서 주변장치의 서비스를 찾았다면, 해당 서비스에서 사용할 수 있는 특성을 찾을 수 있다.

주변장치가 가지고 있는 서비스를 services 프로퍼티로 접근할 수 있는 것처럼

**서비스가 가지고 있는 특성 또한 [CBCharacteristic]? 타입의 characteristics 프로퍼티로 접근**할 수 있다.

주변장치의 services 프로퍼티 처럼 **초기에는 nil 값으로 할당**되어 있다

```swift
open class CBService : CBAttribute {
    ...
    open var characteristics: [CBCharacteristic]? { get }
    ...
}
```

서비스가 가지고 있는 특성을 탐색하기 위해서는

**서비스 인스턴스**가 아닌 **주변장치 인스턴스**의 discoverCharacteristics(_:, for:) 메서드를 사용한다

```swift
// 메서드 원형 
func discoverCharacteristics(_ characteristicUUIDs: [CBUUID]?, for service: CBService)
// 사용
peripheral.discoverCharacteristics(nil, for: service)
```

특정 특성들만 검색하고 다른 특성들은 검색하지 않길 원한다면 첫 번째 인자에 특정 특성들의 UUID 배열을 전달

모든 특성들을 찾고자 한다면 nil을 전달하면 된다.

두 번째 인자인 for service: 에는 특성을 찾을 서비스 인스턴스를 전달한다

탐색에 대한 결과는 CBPeripheralDelegate 프로토콜의

peripheral(_ , didDiscoverCharacteristicsFor:, error:) 메서드에서 받아 볼 수 있다

```swift
/// 특성 탐색 메서드 호출 후 검색되면 호출되는 델리게이트 메서드
/// 주변 기기가 서비스의 특성을 성공적으로 발견하면
/// service의 characteristics 프로퍼티를 통해 접근 가능
/// - Parameters:
///   - peripheral: 이 정보를 제공하는 주변 기기
///   - service: 특성이 속한 서비스
///   - error: 탐색에 실패한 경우 원인을 반환, 성공 시 nil
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?){
}
```

### Subscribing to notifications and indications

특성이 지원하는 경우 ( CBCharacteristic 인스턴스의 properties 프로퍼티 )

주변 장치의 setNotifyValue(_:, for:) 메서드를 호출하여 알림 / 표시를 구독할 수 있음

```swift
// 인자레이블 1: 구독시 true / 구독 해제시 false 
// 인자레이블 2: 구독할 대상 특성(characteristic)
peripheral.setNotifyValue(true, for: characteristic)
```

특성이 해당 기능을 지원하는지 여부는 properties 프로퍼티의 contains 메서드를 사용하여 확인할 수 있다

```swift
for char in characteristics {
    if char.properties.contains(.read) { print("contains read") }
    if char.properties.contains(.write) { writeCharacteristic = char }
    if char.properties.contains(.writeWithoutResponse) { writeCharacteristic = char }
    if char.properties.contains(.notify){ peripheral.setNotifyValue(true, for: char) }
}
```

특성이 지원하는 기능의 목록은 [Characteristic Properties](https://developer.apple.com/documentation/corebluetooth/cbcharacteristicproperties) 참조

구독을 하면 주변 장치의 값이 변경되거나 주변 장치에서 알림 / 표시 패킷이 전송될 때 마다

CBPeripheralDelegate 프로토콜의 

peripheral(_:, didUpdateValueFor:, error:) 델리게이트 메서드가 호출됨

```swift
/// readValue(for:)메서드를 앱이 호출하거나 setNotifyValue를
/// 활성화한 특성 값의 변경사항을 주변장치가 앱에 알릴 때 호출
/// - Parameters:
///   - peripheral: 이 정보를 제공하는 주변장치
///   - characteristic: 변경된 값 또는 readValue로 요청한 값을 가지고 있는 특성
///   - error: 실패한 이유, 성공 시 nil
func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?)
```

setNotifyValue로 구독 활성화 / 비활성화를 하는 setNotifyValue(_:for:) 호출할 때마다 

CBPeripheralDelegate 프로토콜의 메서드인

peripheral(_:didUpdateNotificationStateFor:error:) 메서드가 호출 됨

```swift
/// 지정된 특성 값에 대한 알림 제공을 시작 / 중지하라는 요청을 주변기기가 수신했을 때 호출
/// setNotifyValue(_:for:) 메서드를 호출할 때 해당 메서드가 호출되며 성공하면
/// error는 nil, 실패하면 원인을 반환
/// - Parameters:
///   - peripheral: 이 정보를 제공하는 주변기기
///   - characteristic: 대상 특성
///   - error: 실패한 이유, 성공시 nil
func peripheral(_ peripheral: CBPeripheral, didUpdateNotificationStateFor characteristic: CBCharacteristic,
```

## Writing to a characteristic

특성에 값을 쓰기 위해서는 주변 장치 인스턴스의 writeValue(_:for:type:) 메서드를 호출함

```swift
open class CBPeripheral : CBPeer {
    open func writeValue(_ data: Data, for characteristic: CBCharacteristic, type: CBCharacteristicWriteType)
}
```

data 는 특성에 write할 데이터

characteristic 는 write 할 특성

type은 write의 유형이다

write의 유형에는 2가지가 있다

1. .withResponse : BLE 계층이 주변 기기에게 write 요청을 받고 잘 받았다고 확인을 다시 보내도록함
2. .withoutResponse : 주변 기기에게 확인을 다시 보내도록 요청하지 않음

```swift
connectedPeriphearal?.writeValue(value, for: characteristic, type: .withoutResponse)
connectedPeriphearal?.writeValue(value, for: characteristic, type: .withResponse)
```

write 타입을 .withResponse로 설정하고 writeValue 메서드 호출 시 

주변 기기가 잘 받았다고 확인을 다시 보내는데 해당 내용은 CBPeripheralDelegate 프로토콜의

peripheral(_: didWriteValueFor: error:) 메서드에서 받아 볼 수 있다

```swift
/// 주변 장치가 특성 값을 성공적으로 설정했음을 알림
/// wirteType이 .withResponse일때만 호출
/// - Parameters:
///   - peripheral: 정보를 제공하는 주변 기기
///   - characteristic: 값을 포함한 특성
///   - error: 실패한 이유, 성공시 nil
func peripheral(_ peripheral: CBPeripheral, didWriteValueFor characteristic: CBCharacteristic, error: Error?) {
```

## 정리

1. 주변 기기를 탐색후 연결까지 성공하였다면 CBPeripheral 인스턴스와 
CBPeripheralDelegate 프로토콜을 사용하여
2. discoverServices 메서드를 사용하여 서비스를 탐색하고
3. didDiscoverServices 델리게이트 메서드에서 해당 탐색한 서비스를 받아 볼 수 있음
4. discoverCharacteristics 메서드를 사용하여 서비스의 특성을 탐색 하고
5. didDiscoverCharacteristicsFor 델리게이트 메서드에서 특성을 받아 볼 수 있다
6. setNotifyValue로 해당 특성의 알림 / 표시를 구독할 수 있고
7. 구독한 특성이 값이 변경되었거나 알림이 있는 경우 주변 기기가 
didUpdateValueFor 메서드를 통해 앱에 알려 준다
8. 특성에 값을 write 할 경우 주변 기기의 writeValue 메서드를 호출하고
9. write를 하는 방식에는 withoutResponse와 withResponse 방식이 있다.
