var store = [{
        "title": "[백준 11726] 2 * n 타일링",
        "excerpt":"링크   문제   2×n 크기의 직사각형을 1×2, 2×1 타일로 채우는 방법의 수를 구하는 프로그램을 작성하시오.   아래 그림은 2×5 크기의 직사각형을 채운 한 가지 방법의 예이다.   입력     첫째 줄에 n이 주어진다. (1 ≤ n ≤ 1,000)    출력     첫째 줄에 2×n 크기의 직사각형을 채우는 방법의 수를 10,007로 나눈 나머지를 출력한다.    코드  func solve(n : Int) { \tguard n &gt; 2 else { return n } \tvar arr = [Int](repeating: 0, count: n + 1) \tarr[1] = 1 \tarr[2] = 2 \tfor i in 3 ... n { \t\tarr[i] = arr[i - 1] + arr[i - 2] \t\tarr[i] %= 10007 \t} \t \treturn arr[i] }   풀이 : 조금 더 이해가 되면 작성할 예정  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/11726-2-n/",
        "teaser": null
      },{
        "title": "동적계획법(DP) 이론",
        "excerpt":"동적계획법이란?      최적화 문제를 연구하는 수학이론에서 왔다.   처음 주어진 문제를 더 작은 문제로 나눈 뒤 조각의 답을 계산하고 이러한 답들로 원래 문제에 대한 답을 계산, 도출   어떤 부분문제는 두개 이상의 문제를 푸는데 사용할 수 있어 한번만 계산하고 계산 결과를 재활용하여 속도의 향상을 얻는다   계산한 값을 저장하는 곳을 캐시라고 한다.   이러한 한번만 계산한 값을 재활용 하는 최적화 기법을 메모이제이션 이라고 한다.  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/Algorithm-DP-%EC%9D%B4%EB%A1%A0/",
        "teaser": null
      },{
        "title": "[백준 11727] 2 * n 타일링2",
        "excerpt":"링크 문제   2×n 직사각형을 1×2, 2×1과 2×2 타일로 채우는 방법의 수를 구하는 프로그램을 작성하시오.   입력     첫째 줄에 n이 주어진다. (1 ≤ n ≤ 1,000)    출력     첫째 줄에 2×n 크기의 직사각형을 채우는 방법의 수를 10,007로 나눈 나머지를 출력한다.    앞에 타일링 문제에서 2 * 2 타일이 추가되었을 뿐 개념은 같다 (n - 1)  + (n - 2) * 2 &gt; 2 * 2 타일은 결국 ( n - 2 ) 타일과 같다   func solve(n : Int) -&gt; Int {     if n == 0 { return 0}     if n == 1 { return 1}     if n == 2 { return 3}     var arr = [Int](repeating: 0, count : n + 1)      arr[1] = 1     arr[2] = 3     for i in 3 ... n {         arr[i] = arr[i - 1] + (arr[i - 2] * 2)         arr[i] %= 10007     }     return arr[n] }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ11727-DP/",
        "teaser": null
      },{
        "title": "[백준 1463] 1로 만들기",
        "excerpt":"링크   문제   정수 X에 사용할 수 있는 연산은 다음과 같이 세 가지 이다.     X가 3으로 나누어 떨어지면, 3으로 나눈다.   X가 2로 나누어 떨어지면, 2로 나눈다.   1을 뺀다.            정수 N이 주어졌을 때, 위와 같은 연산 세 개를 적절히 사용해서 1을 만들려고 한다. 연산을 사용하는 횟수의 최솟값을 출력하시오.            입력     첫째 줄에 1보다 크거나 같고, 106보다 작거나 같은 정수 N이 주어진다.    출력     첫째 줄에 연산을 하는 횟수의 최솟값을 출력한다.    시도 1 :  메모이제이션을 사용한 재귀로 구현.   var cache = [Int](repeating: 0, count: 1000001)  func solve(x: Int) -&gt; Int { \tguard x &gt;= 1 else { return 0 } \tif x == 1 { return 1 } \tif cache[x] &gt; 0 { \t\treturn cache[x] \t} \tvar minVal = Int.max \tminVal = min(solve(x: x - 1), minVal) \tif x % 3 == 0 { minVal = min(solve(x: x / 3), minVal) }  \tif x % 2 == 0 { minVal = min(solve(x: x / 2), minVal) } \tcache[x] = minVal + 1 \treturn minVal + 1 \t}  if let x = Int(readLine()!) { \tprint(solve(x: x) - 1) }   x가 10000 이하일때는 잘 동작했지만 그 이상이 되면 재귀의 깊이가 깊어져 런타임 에러 발생.   고민고민을 해봤지만 고민만 1시간이 넘어가 결국 구글링…   재귀가 아닌 상향식 DP를 사용하여 접근하는 방법이 많았다   일련의 규칙이 있는데   x == 1 ,  0  , 연산 필요 없음 x == 2 , ( 2 / 2 ) = 1, 1번 연산 x == 3,  ( 3 / 3 ) = 1, 1번 연산 x == 4,  ( 4 / 2 ) = 2, (2 / 2) = 1, 총 2번 연산 x == 5 , ( 5 - 1 ) =  4 , ( 4 / 2 ) = 2, ( 2 / 2 ) = 1, 총 3번 연산   x 가 4 이상 일 때는 이 전의 결과를 포함하고 있다 .   이를 코드로 나타내면    func solve(x: Int) -&gt; Int {     if x == 1 { return 0 }     else if x == 2 { return 1 }     else if x == 3 { return 1 }     else{         var cache = [Int](repeating: 0, count: x + 1)         cache[1] = 0         cache[2] = 1         cache[3] = 1                  for i in 4 ... x {             cache[i] = cache[i - 1] + 1             if i % 3 == 0 {                 cache[i] = min(cache[i / 3] + 1, cache[i])             }             if i % 2 == 0 {                 cache[i] = min(cache[i / 2] + 1, cache[i])             }         }         return cache[x]     } } if let x = Int(readLine()!) {     print(solve(x: x)) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ1463-DP/",
        "teaser": null
      },{
        "title": "[백준 9095] 1, 2, 3 더하기",
        "excerpt":"링크   문제   정수 4를 1, 2, 3의 합으로 나타내는 방법은 총 7가지가 있다. 합을 나타낼 때는 수를 1개 이상 사용해야 한다.      1+1+1+1   1+1+2   1+2+1   2+1+1   2+2   1+3   3+1   정수 n이 주어졌을 때, n을 1, 2, 3의 합으로 나타내는 방법의 수를 구하는 프로그램을 작성하시오.   입력     첫째 줄에 테스트 케이스의 개수 T가 주어진다. 각 테스트 케이스는 한 줄로 이루어져 있고, 정수 n이 주어진다. n은 양수이며 11보다 작다.    출력     각 테스트 케이스마다, n을 1, 2, 3의 합으로 나타내는 방법의 수를 출력한다.    풀이 :  1~3의 합으로 정수 N을 나타내는 경우의 수만 구하면된다,  구성은 상관없다는 소리.   N == 1 일 때 경우의 수 :   1  N == 2 일 때 경우의 수 :   1 + 1  2  N == 3 일 때 경우의 수 :   1 + 1 + 1  1 + 2  2 + 1  3   일 때,     N == 4는 다음과 같다   N == 4 :    1 + 1 + 1 + 1 :     3의 경우의 수 + 1    1 + 1 + 2 :             2의 경우의 수 + 2   1 + 2+ 1 :             3의 경우의 수 + 1   2 + 1 + 1 :             3의 경우의 수 + 1   2 + 2 :                     2의 경우의 수 + 2   1 + 3 :                     1의 경우의 수 + 3   3 + 1 :                     3의 경우의 수 + 1    1의 경우의 수 + 2의 경우의 수 + 3의 경우의 수 의 합과 같다.  수식으로 표현하면 N = (N - 3) + (N - 2) + (N - 1) 이므로 이를 그대로 사용!    func solve(n : Int) -&gt; Int{     if n == 0 { return 0 }     else if n == 3 { return 4 }     else if n == 2 { return 2 }     else if n == 1 { return 1 }     var arr = [Int](repeating:0, count: n + 1)     arr[1] = 1     arr[2] = 2     arr[3] = 4     for i in 4 ... n {         arr[i] = arr[i - 3] + arr[i - 2] + arr[i - 1]     }     return arr[n] }  var map = [Int:Int]() map[0] = 0 map[1] = 1 map[2] = 2 map[3] = 4 func recursive(n : Int) -&gt; Int {     if let res = map[n] {         return res     }          map[n] = recursive(n: n - 3) + recursive(n: n - 2) + recursive(n: n - 1)     return map[n]! } if let count = Int(readLine()!){          for _ in 0 ..&lt; count {         let n = Int(readLine()!)!         // 상향식         /*print(solve(n: n))*/         // 하향식         print(recursive(n: n))     } }   상향식과 하향식 모두 가능!  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ9095-DP/",
        "teaser": null
      },{
        "title": "[백준 10844] 쉬운 계단 수",
        "excerpt":"링크   문제 45656이란 수를 보자.   이 수는 인접한 모든 자리수의 차이가 1이 난다. 이런 수를 계단 수라고 한다.   세준이는 수의 길이가 N인 계단 수가 몇 개 있는지 궁금해졌다.   N이 주어질 때, 길이가 N인 계단 수가 총 몇 개 있는지 구하는 프로그램을 작성하시오. (0으로 시작하는 수는 없다.)   입력     첫째 줄에 N이 주어진다. N은 1보다 크거나 같고, 100보다 작거나 같은 자연수이다.    출력     첫째 줄에 정답을 1,000,000,000으로 나눈 나머지를 출력한다.    풀이   N == 1 일 때, 계단 수 : 1,2,3,4,5,6,7,8,9  N == 2 일 때, 계단 수 : 10,12, 21, 23, 32, 34, 43, 45, 54, 56, 65, 67, 76, 78, 87, 89, 98    규칙을 찾아 보자  N == 1 일 때, 계단 수 에서 N == 2일 때, 계단 수를 구할 수 있을까?  N == 2 일 때, 계단수 10, 12를 봐보자   N == 2 일 때, 10과 12는 N == 1 일 때, 1에서 0 과 2를 1의 자리에 넣어 준 것과 같다  N == 2 일 때, 21과 23은 N == 1 일 때, 2에서 1과 3을 1의 자리에 넣어 준 것과 같다.  N == 2 일 때의 계단 수는 N == 1일 때 계단 수에서 1의 자리에서 +1과, -1을 해준 숫자들이 들어감을 확인할 수 있다  N == 2 일 때, 10과 12는 N == 1 일 때, 1에  1 - 1, 즉 0을 붙여 10, 1 에 1 + 1, 즉 2를 붙여 12가 만들어 짐을 알 수 있다.  이를 이용하면 N이 주어질 때 마지막 1의 자리가 K인 숫자의 계단 수의 갯수는  N - 1 번째의 K - 1의 계단 수의 갯수 + N - 1번째의 K + 1의 계단수의 갯수일 것이다  예를 들어 N == 2 일 때 1의 자리 숫자가 3으로 끝나는 계단 수의 갯수는   N == 1 일 때, 2의 갯수,  그리고 4의 갯수를 합치면 된다  글 보다 표를 그려 확인 해보자     수식으로 구성 해보자   N : 숫자의 길이, K : N 의 계단 수의 1의 자리   N[K] = N-1[K - 1] + N-1[K+1] 이 때, 주의 할 것이 있다   N[K] == 0 일 경우엔  이전 단계에서 1일 경우만 더해주고 ( 즉, N-1[1])  K == 9 : 8일 경우만 더해 준다 ( 즉 N-1[8])     이를 그대로 코드로 옮겨 보자   func solve(n : Int) {     if n == 1 { // 1일 경우는 무조건 9개 밖에 없다         print(9)         return     }     let mod = 1_000_000_000 // 결과값에서 쓰일 나머지 연산 값      var map = Array(repeating: Array(repeating: 0, count: 10), count: 101)          for i in 1 ... 9 {         map[1][i] = 1     }          for i in 2 ... n {         map[i][0] = map[i-1][1]         map[i][9] = map[i-1][8]         for k in 1 ... 8 {             map[i][k] = (map[i-1][k - 1] + map[i-1][k + 1]) % mod         }     }          let result = map[n].reduce(0,+)          print(result % mod) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ10844-DP/",
        "teaser": null
      },{
        "title": "[백준 11057] 오르막 수",
        "excerpt":"링크   문제 오르막 수는 수의 자리가 오름차순을 이루는 수를 말한다. 이때, 인접한 수가 같아도 오름차순으로 친다.   예를 들어, 2234와 3678, 11119는 오르막 수이지만, 2232, 3676, 91111은 오르막 수가 아니다.   수의 길이 N이 주어졌을 때, 오르막 수의 개수를 구하는 프로그램을 작성하시오. 수는 0으로 시작할 수 있다.    입력     첫째 줄에 N (1 ≤ N ≤ 1,000)이 주어진다.    출력     첫째 줄에 길이가 N인 오르막 수의 개수를 10,007로 나눈 나머지를 출력한다.    풀이   N == 1일 때,  아래와 같다                   Index       0       1       2       3       4       5       6       7       8       9                       오르막 수의 개수       1       1       1       1       1       1       1       1       1       1             N == 2일 때, 숫자의 길이는 2개 즉 ㅁㅁ 으로 구성되어지고  이 때 K == 0인 경우                   뒤의 숫자       0       1       2       3       4       5       6       7       8       9                       결과       00       01       02       03       04       05       06       07       08       09           N == 2 &amp;&amp; K == 0                    Index       0       1       2       3       4       5       6       7       8       9                       오르막 수의 개수       10       ?       ?       ?       ?       ?       ?       ?       ?       ?           K == 1인 경우                   뒤의 숫자       0       1       2       3       4       5       6       7       8       9                       결과       X       11       12       13       14       15       16       17       18       19           N == 2 &amp;&amp; K == 0                    Index       0       1       2       3       4       5       6       7       8       9                       오르막 수의 개수       10       9       ?       ?       ?       ?       ?       ?       ?       ?           보는 것과 같이 k 숫자의 뒤에 k ~ 9 까지가 붙어 오르막수를 만들 수 있다    이를 수식으로 만들면  N[K] = N-1[K] + N-1[K+1] + N-1[K+2] ….. N - 1[9]    이를 이용해 그대로 코드로 구현    func solve(n: Int) {     if n == 1 { // n이 1이면 10개         print(10)         return     }     let mod = 1_000_7 // 정답에 나머지값을 계산해 출력     var map = Array(repeating:Array(repeating:0, count: 10), count: 1001)     for i in 0 ... 9 {         map[1][i] = 1     }     for i in 2 ... n {         for j in 0 ... 9 {             for k in j ... 9 { // j가 0 이면 0 ~ 9 까지, j가 1이면 1 ~ 9 까지                  map[i][j] += map[i-1][k] % mod             }         }     }     print(map[n].reduce(0, +) % mod) }    ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ11057-DP/",
        "teaser": null
      },{
        "title": "[백준 2193] 이친수",
        "excerpt":"링크   문제 0과 1로만 이루어진 수를 이진수라 한다. 이러한 이진수 중 특별한 성질을 갖는 것들이 있는데, 이들을 이친수(pinary number)라 한다. 이친수는 다음의 성질을 만족한다.      이친수는 0으로 시작하지 않는다.    이친수에서는 1이 두 번 연속으로 나타나지 않는다. 즉, 11을 부분 문자열로 갖지 않는다.  예를 들면 1, 10, 100, 101, 1000, 1001 등이 이친수가 된다. 하지만 0010101이나 101101은 각각 1, 2번 규칙에 위배되므로 이친수가 아니다.    N(1 ≤ N ≤ 90)이 주어졌을 때, N자리 이친수의 개수를 구하는 프로그램을 작성하시오.    입력      첫째 줄에 N이 주어진다.     출력      첫째 줄에 N자리 이친수의 개수를 출력한다.     풀이     N == 1 일 때, 이친수는 1   N == 2 일 때, 이친수는 10   N == 3 일 때, 이친수는 100, 101   N == 4 일 때, 이친수는 1000, 1001, 1010     유심히 보면 규칙이 보인다.   N == 4 에서 1000과 1001은 N == 3의 100을 가지고 만들 수 있다.   N == 4 에서 1010은 N == 3의 101을 가지고 만들 수 있다.     차이점은 뭘까?   문제에서 조건 2에 의해 1이 두번 연속으로 나타나면 안된다  즉 끝자리가 1이면 다음에 나타나는 수는 0밖에 없고  끝 자리가 0이면 다음에 나타나는 수는 0, 1 모두 가능하다     수식을 세워보자!  K == 0 일 때  N[0] = N -1[0] + N - 1[1]   N번째 0으로 끝나는 이친 수의 갯수는 N-1번째 0으로 끝나는 이친수 갯수와 1로 끝나는 이친수 갯수의 합이다  N[1] = N-1[0]  N번째 1로 끝나는 이친 수의 갯수는 N-1번째 1로 끝나는 이친수 갯수와 같다    코드     func solve(n: Int){     if n == 1 {         print(1)         return     }          var map = Array(repeating:Array(repeating:0, count:2), count: n + 1) \t\t//n == 1일 때 이친수는 1 하나뿐     map[1][0] = 0      map[1][1] = 1          for i in 2 ... n {         map[i][0] = map[i-1][0] + map[i-1][1]         map[i][1] = map[i-1][0]     }          print(map[n].reduce(0,+)) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ2193-DP/",
        "teaser": null
      },{
        "title": "[백준 9465] 스티커",
        "excerpt":"링크   이번 포스트 부터 문제와 입력/출력은 따로 작성하지 않겠습니다 상단 링크에서 확인해주세요!    풀이    스티커를 선택하는 방법은 3가지가 있다                   아무것도 선택 안함       위에만 선택       아래만 선택                       x       o       x                 x       x       o           그리고 몇 가지 정의를 한다   W[0][N] : 첫 번째 행의 N 번째 숫자  W[1][N] : 두 번째 행의 N 번째 숫자   D[0][N] : 아무것도 선택 안했을 경우 N 숫자에서의 최대값   D[1][N] : 첫 번째 행을 선택했을 경우 N 숫자에서의 최대값   D[2][N] : 두 번째 행을 선택했을 경우 N 숫자에서의 최대값     경우 1 : N번째 숫자에서 아무것도 선택안할 경우에는 N - 1 번째의 최대값 을 넣는다  D[0][N] = max(D[0][N-1],D[1][N-1],D[2][N-1])   경우 2: N번째 숫자에서 첫 번째 행을 선택했을 경우 N-1번째의 아무것도 선택 안했을 경우최대값과,  N-1번째의 두 번째 행을 선택했을 경우의 최대값중 큰값과 첫번째 행 W[0][N]을 더한다  D[1][N] = max(D[0][N-1],D[2][N-1]) + W[0][N]  경우 3: N번째 숫자에서 두 번째 행을 선택했을 경우 N-1번째의 아무것도 선택 안했을 경우최대값과,  N-1번째의 첫 번째 행을 선택했을 경우의 최대값중 큰값과 두 번째 행 W[1][N]을 더한다  D[2][N] = max(D[0][N-1],D[1][N-1]) + W[1][N]    코드   func solve(n: Int, arr: [[Int]]) {     let size = n     var res = [[Int]](repeating:[Int](repeating:0, count: size), count: 3)     res[1][0] = arr[0][0]     res[2][0] = arr[1][0]     for i in 1 ..&lt; size {         res[0][i] = max(max(res[1][i-1], res[2][i-1]), res[0][i-1])         res[1][i] = max(res[0][i-1], res[2][i-1]) + arr[0][i]         res[2][i] = max(res[0][i-1], res[1][i-1]) + arr[1][i]     }          let result = max(max(res[0][size - 1], res[1][size - 1]), res[2][size - 1])     print(result) }  if let tc = Int(readLine()!) {     for _ in 0 ..&lt; tc {         let size = Int(readLine()!)!         let col1 = readLine()!.split(separator: \" \").map { Int(String($0))! }         let col2 = readLine()!.split(separator: \" \").map { Int(String($0))! }         var arr = [[Int]]()         arr.append(col1)         arr.append(col2)         solve(n: size, arr: arr)     } }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ-9465-DP/",
        "teaser": null
      },{
        "title": "[백준 2156] 포도주 시식",
        "excerpt":"링크   풀이    정의  W[N] : N번째 포도주의 양   D[N] : N번째에서 최대로 마실 수 있는 포도주 양  ex) D[1] : 1번쨰에서 최대로 마실 수 있는 포도주의 양은 6이다                   index       0       1       2       3       4       5       6                       W[N]       0       6       10       13       9       8       1               처음부터 한번 수식을 세워보자!  D[0]  일 때 : 0   D[1] 일 때 : 1잔을 마시는게 최대값 즉, W[1]   D[2] 일 때 : 2잔을 모두 마시는게 최대값 즉, W[1] + W[2]   D[3] 일 때 : 총 3가지의 경우의 수가 있다.      안마시는 경우, 이땐 D[2]가 최대값이 된다     연속 1잔만 마시는 경우, 이전에 마시면 연속 2잔이 되기 때문에 이때는 W[1] + W[3]    연속 2잔 마시는 경우, 이전전에선 마시면 안된다! W[2] + W[3] + W[0]    이제 조금 정리를 해보자.  연속 1잔만 마시는 경우 : W[1]+W[3] -&gt; D[1] + W[3]과 같다   연속 2잔 마시는 경우 : W[2] + W[3] + D[0]과 같다   즉, D[3]일 때 3가지 경우의 수식은       D[3] = D[2]   D[3] = D[1] + W[3]   D[3] = W[2] + W[3] + D[0]   이 3가지 경우의 수 중 최대값을 구하면된다.   코드로 짤수 있도록 [숫자]를 n으로 변경해보자   예를 들어 D[3] = D[n] 이면, D[2]는 3-1 = 2이므로 D[n - 1]이 된다      D[n] = D[n - 1]   D[n] = D[n-2] + W[n]   D[n] = W[n -1] + W[n] + D[n - 3]   이제 이 수식을 이용해 코드를 짜보자!    func solve(n: Int){     var wines = [Int](repeating: 0, count: n + 1)     var dp = wines          for i in 1 ... n {         wines[i] = Int(readLine()!)!     }          if n == 1 {         print(wines[1])         return      }else if n == 2 {         print(wines[1] + wines[2])         return     }     dp[1] = wines[1]     dp[2] = wines[1] + wines[2]          for i in 3 ... n {         var maxWines = dp[i - 1] // 0 잔 마실 때         maxWines = max(maxWines, dp[i - 2] + wines[i]) // 1잔 마실때 vs 0잔 마실 때 최대값 비교         dp[i] = max(maxWines, dp[i - 3] + wines[i] + wines[i - 1]) // 2잔 마실 때와 위의 결과값 비교     }          print(dp[n]) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ2156-DP/",
        "teaser": null
      },{
        "title": "[백준 11053] 가장 긴 증가하는 수열",
        "excerpt":"링크   풀이    W[n] : n 번째에 위치해있는 정수                   1       2       3       4       5       6                       10       20       10       30       20       50           D[n] : n의 위치에서 끝나는 최장 길이 수열    k : 0 ~ n - 1까지의 수라고 정의할 때   W[k] &lt; W[n] 일 경우   D[n] = max(D[n], D[k] + 1)로 갱신한다    코드   func solve() {     let arr = readLine()!.split(separator: \" \").map { Int(String($0))! }          var dp = [Int](repeating: 1, count: arr.count)          for i in 0 ..&lt; arr.count {         for j in 0 ..&lt; i {             if arr[i] &gt; arr[j] {                 dp[i] = max(dp[i], dp[j] + 1)             }         }     }          print(dp.max()!) }  ","categories": ["Algorithm","DP","LIS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/lis/BOJ11053-DP/",
        "teaser": null
      },{
        "title": "이진 탐색",
        "excerpt":"정렬된 배열에서 원소 x를 찾고자 할 때 사용       찾고자 하는 x를 중간 원소와 비교   x가 중간 원소보다 크다면 오른쪽 절반을   x가 중간 원소보다 작다면 왼쪽 절반을 재탐색한다   1 ~ 3과정을 x를 찾거나 부분 배열의 크기가 0이 될 때까지 반복한다   코드   func binarySearch(arr: [Int], find: Int) -&gt; Int {     var low = 0     var high = arr.count - 1     var mid : Int          while low &lt;= high {         mid = (low + high) / 2         if arr[mid] &gt; find {             high = mid - 1         }else if arr[mid] &lt; find {             low = mid + 1         }else {             return mid         }     }     return -1 }   ","categories": ["Algorithm","Search","LIS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/search/lis/binary-search-DP/",
        "teaser": null
      },{
        "title": "[백준 11055] 가장 큰 증가 부분 수열",
        "excerpt":"링크   풀이   가장 긴 증가하는 수열 문제와 비슷하다.  다만 길이가 아니라 합이 라는게 차이 .    따라서 가장 긴 증가하는 수열의 코드에서 if 조건문의 수식만 살짝 바꿔주면 된다    정의를 살펴 보면  arr[n] : 문제의 입력으로 주어진 배열, n번째 숫자  map[n] : n번째 에서 가장 큰 수열의 합  k = 0 ..&lt; n 까지의 인덱스    따라서 수식은   map[n] = max(map[n], arr[n] + map[k])     위에 정의된 수식을 2중 포문으로 탐색한다   // 0 부터 배열의 마지막 인덱스까지 탐색 for i in 0 ..&lt; arr.count {  // 자기 자신은 부분 수열의 합에 항상 들어감 \tmap[i] = arr[i]  \t// 0 ~ i - 1까지 탐색 , j == k( 위에 정의한 k를 j로 사용) \tfor j in 0 ..&lt; i {  \t// i 인덱스의 값보다 j 인덱스의 값이 작으면 부분 수열에 포함  \t\tif arr[i] &gt; arr[j] {  \t\t// 현재 map[i]값 보다 arr[i] + map[j]의 값이 더 크면 더 큰 부분 수열의 합 \t\tmap[i] = max(map[i], arr[i] + map[j])  \t} }   최종 코드는 아래와 같다    func solve(n : Int) {     let arr = readLine()!.split(separator:\" \").map { Int(String($0))! }     var map = [Int](repeating:0, count: n + 1)          for i in 0 ..&lt; arr.count {         map[i] = arr[i]         for j in 0 ..&lt; i {             if arr[i] &gt; arr[j] {                 map[i] = max(map[i], map[j] + arr[i])             }         }     }          print(map.max()!) }  ","categories": ["Algorithm","DP","LIS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/lis/BOJ11055-DP/",
        "teaser": null
      },{
        "title": "[백준 11722] 가장 긴 감소하는 부분 수열",
        "excerpt":"링크   풀이 이전 문제 11053, 11055와 사실상 같은 문제  11053  11055    코드  func solve(n : Int) {     let arr = readLine()!.split(separator: \" \").map { Int(String($0))! }     var map = [Int](repeating:1, count: n)          for i in 0 ..&lt; arr.count {         for j in 0 ..&lt; i {             if arr[i] &lt; arr[j] {                 map[i] = max(map[i], map[j] + 1)             }         }     }          print(map.max()!) }  ","categories": ["Algorithm","DP","LIS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/lis/BOJ11722-DP/",
        "teaser": null
      },{
        "title": "ARC 및 참조 타입",
        "excerpt":"ARC Swift에서 메모리를 자동으로 관리   특정 객체가 참조되면 참조 카운트(Reference Count, RC)를 1증가 시키고, 모든 참조가 해제되어 0이 되면 메모리에서 해제시킨다.  컴파일 단계에서 실행되고 이 때문에 추가 자원 즉, 오버헤드가 있는 GC 대비 효율적이지만  참조 순환 즉, Memory Leak을 발생시킬 수 있다      순환 참조가 발생하는 경우      프로퍼티에서 인스턴스를 서로 강하게 참조    class App {     var os : iOS?          deinit {         print(\"app deinit\")     } }  class iOS {     var applications : App?          deinit {         print(\"ios deinit\")     } }  var app : App? = App() var ios : iOS? = iOS()  app?.os = ios ios?.applications = app   app = nil ios = nil   위 코드에서 각각 프로퍼티 os, applications가 App, iOS 인스턴스를 참조하여  App, iOS의 RC는 1씩 증가한 1인 상태이다  그 상태에서 참조 변수 app,ios가 nil로 변경되어 프로퍼티에 접근할 수 없어 순환참조가 발생하여 Memory Leak발생          클로저에서 참조하는 경우      class App {     var os : iOS?     let name : String          init(name: String) {         self.name = name     }          lazy var info: () -&gt; String = {         return self.name     }     deinit {         print(\"app deinit\")     } }  var app : App? = App(name: \"Wallet\") app = nil    위의 경우처럼 info 안에서 self를 참조 하고 있을때,   참조변수 app을 nil로 변경되면 클로저와 인스턴스 사이 순환참조가 발생된다        순환 참조 방지 하는 방법       weak, unowend 사용            해당 키워드들로 인스턴스를 참조시 RC가 증가하지 않는다       weak은 아래서 설명하겠지만 옵셔널 타입으로 옵셔널 바인딩, 체이닝을 사용하여 런타임 크래시를 방지할 수 있다       unowend는 생명주기가 길거나 인스턴스가 존재함을 확신할 때 사용된다           클로저에서 캡처리스트 작성            캡처리스트란 클로저가 참조하는 대상, 참조하는 방식을 지정하는 형식이다       즉, 강하게 캡처(참조)할지 약하게 캡처(참조)할지 지정이 가능하다             참조 방식     strong            객체를 소유하여 RC를 증가시키는 프로퍼티       ARC로 인한 메모리 해제를 피하고 객체를 안전하게 사용할 때 사용           weak            객체를 소유하지 않고 주소값만을 가지고 있는 포인터 개념       메모리에서 해제될 경우 자동으로 nil로 초기화되기 때문에 옵셔널 타입으로 사용해야한다           unowend            weak과 비슷한 개념이지만 nil값이 될 수 없기 때문에 옵셔널 타입으로 선언하면 안된다           잘못된 설명이 있으면 지적 부탁드립니다.   ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/ARC/",
        "teaser": null
      },{
        "title": "클로저",
        "excerpt":"클로저         클로저의 형태            이름을 가진 어떤 값도 캡처하지 않는 전역 함수       이름을 가진 자신을 감싸고 있는 함수에서 값을 캡쳐해 가질 수 있는 중첩 함수       이름이 없으며 주변 환경의 값을 캡처해 가질 수 있는 클로저 표현식           @escaping            인자값으로 전달된 클로저를 저장해 두었다가 다른 곳에서도 실행할 수 있도록 허용해주는 속성       인자값으로 전달된 클로저는 기본적으로 탈출불가의 성격을 가진다       이는 함수 내에서, 직접 실행을 위해서만 사용해야하는 것을 의미한다       중첩된 내부 함수에서도 사용이 불가하다           func outerFunc( c: () -&gt; () ) -&gt; () -&gt; (){     c()     func innerFunc() {         c()     } \t\t// innerFunc() 안에서 매개변수 c를 호출하고 있기 때문에 에러 발생     return innerFunc  }   let inner = outerFunc {     print(\"run func\") }   inner()   이러한 제약조건을 모두 제거하여 사용 가능 하게 만들어 주는 것이 @escaping 속성이다  아래와 같은 상황에서 사용       완료에 따른 처리   비동기로 실행 시 함수 사이의 실행 순서를 정할 수 있음              값의 캡처           클로저 내부에서 사용되는 외부 변수의 값을 내부적으로 저장, 이를 캡처되었다고 한다   클로저에서의 캡처는 value type이여도 reference 캡처(카피)를 한다. 변수가 사용되는 시점의 값을 캡처   단, capture list를 이용하면 value 카피로 사용 가능하다.   value 캡쳐된 값은 클로저안에서 변경이 불가하다   Reference Capture   var anInteger = 42 let testClosure = {     // anInteger는 capture되는 순간 reference copy됨     print(\"Integer is: \\(anInteger)\") } testClosure() // \"Integer is 42\" anInteger = 84  testClosure() // \"Integer is 84\"   Value Capture   var anInteger = 42  let testClosure = { [anInteger] in     // anInteger는 capture되는 순간 value copy됨     print(\"Integer is: \\(anInteger)\") } testClosure() // \"Integer is 42\" anInteger = 84  testClosure() // \"Integer is 42\"   ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/Closure/",
        "teaser": null
      },{
        "title": "defer",
        "excerpt":"defer        작성된 위치와 순서에 상관없이 함수가 종료되기 직전에 호출된다   defer블록을 읽기전에 함수가 종료되면 defer블록은 실행되지 않는다.   defer 블록은 여러번 사용가능하다. defer문을 만나면 순차적으로 스택에 저장되고 스코프 종료 후 하나씩 pop해서 실행하기에 마지막 defer문 부터 역순으로 실행된다   defer 블록은 중첩으로도 사용 가능하다. 이때 순서는 바깥쪽 defer문으로부터 안쪽 defer문의 순서로 실행된다  ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/defer/",
        "teaser": null
      },{
        "title": "as as? as!",
        "excerpt":"                       설명       실행 시점       캐스팅 종류                       as       컴파일러가 타입 변환의 성공을 보장       컴파일 타임       업 캐스팅                 as?       변환에 실패하는 경우 nil을 반환       런타임       다운 캐스팅                 as!       변환에 실패하는 경우 런타임에러 발생       런타임       다운 캐스팅          ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/1-type-casting/",
        "teaser": null
      },{
        "title": "Frame과 Bounds",
        "excerpt":"Frame      상위뷰 좌표 시스템 내에서 View의 위치와 크기      Bounds      자기 자신의 좌표시스템에서의 (sub view들의)위치와 크기, 부모뷰와는 관계가 없다   default origin은 0,0이다   origin의 변경은 sub view들의 위치가 변경됨을 의미   sub view의 위치가 변한다는 것은 그려져야하는 위치가 달라지는 것이지 sub view들의 frame 값의 변화는 없다   스크롤 시 sub view들의 위치가 달라지는 것이 대표적인 예이다  ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/3-frame-bounds/",
        "teaser": null
      },{
        "title": "오토레이아웃의 우선순위",
        "excerpt":"constraint의 priority      제약 사항간의 우선순위   뷰들의 크기가 유동적으로 변할 때, 제약들간에 충돌이 발생할 수 있다   이 때 우선순위를 결정함으로 충돌을 해결할 수 있다.  ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/4-autolayout-priority/",
        "teaser": null
      },{
        "title": "클래스와 구조체",
        "excerpt":"               Class       Struct                       레퍼런스 타입       밸류 타입                 객체화시 힙영역에 저장되고 그 주소값은 스택 영역에 저장, ARC로 메모리 관리       스택 영역에 저장                 상속가능       상속 불가, Protocol은 사용가능하다                 대입 연산 시 레퍼런스 공유       대입 연산 시  값 복사          ","categories": ["Swift"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/swift/Class-Struct-02/",
        "teaser": null
      },{
        "title": "CollectionViewLayout",
        "excerpt":"일반적인 collectionview의 delegate와 datasource는  화면에 셀을 표시하는 역할을 담당합니다  표시 할 때 구성과 같은 layout은 UICollectionViewLayout을 구현하여 처리해야합니다    커스텀 CollectionViewLayout의 주 역할은 UICollectionView에서 요청하는 레이아웃 관련 정보를 제공하는 것입니다.  레이아웃을 미리 준비해 놓았다가 UICollectionView에서 요청하면 준비한 레이아웃 정보를 제공합니다.  이 때 몇가지 필수 메소드들이 존재합니다        prepare()            UICollectionView에 표시되는 전체 크기를 계산하고 각 셀의 레이아웃 속성, collectionView의 크기와 cell의 위치를 미리 계산(캐싱)하여 메모리에 적재한 뒤 유지합니다.           collectionViewContentSize            collectionView의 전체 높이와 너비를 반환합니다.       화면에 보이는 contents 뿐만 아니라 collectionView의 전체를 반환해야 합니다.       collectionView는 이 정보를 활용하여 내부적으로 scrollView의 크기를 구성합니다.           layoutAttributesForElements (in :)            in의 범위 안에 있는 모든 셀들의 레이아웃 속성들을 배열에 담아 반환합니다           **layoutAttributesForItem (at :) **            at으로 들어온 cell의 레이아웃 속성을 반환합니다.             호출 순서  Layout prepare() : 전체 크기, 셀의 위치를 미리 계산  collectionView numberOfItemsInSection : 아이템의 전체 개수  Layout collectionViewContentSize : collectionView의 전체 크기(너비, 높이)  Layout layoutAttributesForElements : 범위 안에 있는 모든 셀들의 레이아웃 속성  Layout collectionViewContentSize :  collectionView의 전체 크기(너비, 높이)  collectionView cellForItemAt : cell 표시   ","categories": ["iOS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/ios/1-custom-layout/",
        "teaser": null
      },{
        "title": "UICollectionViewDataSourcePrefetching",
        "excerpt":"UITableView/UICollectionView 에서 Pagenation을 위해 보통 아래 방법을 사용했다.    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {         if indexPath.row == myItemList.count - 1 {             fetchNextPage()         }     }    보여지는 Cell을 기준으로 List 의 마지막 아이템을 부르기 전에 다음 리스트 호출을 하는 식이다.  하지만 이번에 과제를 하면서 너무 버벅여 다른 방법을 찾아봤는데, UICollectionViewDataSourcePrefetching 프로토콜이 존재하였다  ‘willDisplay’ 이 실제 보여지는 Cell을 기준으로 한다면 prefetchDataSource 는 이 작업을 백그라운드로 옮겨와 처리하는 것이다.    extension ViewController: UICollectionViewDataSourcePrefetching {     func collectionView(_ collectionView: UICollectionView, prefetchItemsAt indexPaths: [IndexPath]) { \t\t//내용      } }   이렇게 수정 후 눈에 띄게 속도가 향상되었다!!!  ","categories": ["iOS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/ios/2-UICollectionViewDataSourcePrefetching/",
        "teaser": null
      },{
        "title": "Application 생명 주기",
        "excerpt":"App 생명주기란     앱의 실행부터 종료까지의 주기를 말하며, 앱이 foreground나 background에 있을 때 시스템 알림에 응답하고 기타 중요한 시스템 관련 이벤트를 처리하는 단계들을 말한다.       앱 실행시   UIAppliation 객체를 생성한다.  이후 UIApplication 어노테이션이 있는 객체를 찾아 AppDelegate를 생성한다.  Main Run Loop ( Main Event Loop)를 실행하고  Main Run Loop는 발생한 이벤트를 큐에 담아놓고  담겨 있는 이벤트를 꺼내 하나하나 실행하여 처리한다  AppDelegate 객체는 Life Cycle을 전달 받기 때문에 이를 통하여 현재 상태를 알 수 있다    Life Cycle     Not Running            아무 것도 하지 않는 상태 혹은, 실행 중이나 시스템에 의해 종료된 상태           In-Active            상태 전환 과정에서 잠시 머무르는 상태           Active            실제 앱이 실행 되는 상태( 이벤트를 받는 단계 )           BackGround            Suspend 진입 전에 거치는 단계       데이터의 저장등의 작업을 처리한다       일반적인 앱은 잠시 머물고 바로 Suspend상태로 진입하지만       음악, 통화, 녹음등의 앱은 이 상태에서도 동작한다           Suspend            BackGround 상태지만 아무 실행도 하지 않는 상태, Not Running 상태와 같다       시스템이 임의로 BackGround상태를 Suspend로 만든다 ( 리소스 해제 )          ","categories": ["iOS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/ios/3-App-%EC%83%9D%EB%AA%85%EC%A3%BC%EA%B8%B0/",
        "teaser": null
      },{
        "title": "ViewController 생명 주기",
        "excerpt":"iOS에서는 화면전환을 할 때 기존의 화면 위에 새로운 화면을 쌓는 식으로 화면 전환을 합니다.  이 때 각각의 ViewController는 자신만의 생명주기를 가지고 있습니다  그래서 상황에 맞는 함수들이 호출 되는데 이 생명주기를 나타내는 대표적인 메소드들은 다음과 같습니다        ViewDidLoad            ViewController 클래스가 생성될 때 딱 한번 실행됩니다.       보통 초기화 작업이 이루어집니다           ViewWillAppear            화면에 나타나기 직전에 실행됩니다       ViewDidload와 다르게 나타나기 직전마다 항상 실행됩니다           ViewDidAppear            화면에 나타난 직후에 실행됩니다.           ViewWillDisAppear            화면에서 사라기지 직전에 실행됩니다           ViewDidDisAppear            화면에서  사라지고 난 직후에 실행됩니다          ","categories": ["iOS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/ios/3-ViewController-%EC%83%9D%EB%AA%85%EC%A3%BC%EA%B8%B0/",
        "teaser": null
      }]
