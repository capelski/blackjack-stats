Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Scenario: Individual expected result
    Then the following individual expected result scenarios are considered
      | Hand resolver      | Rules                                                             | Score | Probability           | Win                    | Push                 | Lose                   | Edge                 |
      | 17 stand threshold | {}                                                                | 17    | 0.14512590450523094   | 0.2815928473666239     | 0.14512590450523458  | 0.5732812481281165     | -0.29168840076149266 |
      | Optimal ROI        | {}                                                                | 15    | 0.12627279484635356   | 0.2815928473666239     | 0                    | 0.7184071526333512     | -0.4368143052667273  |
      | Optimal ROI        | {"doubling": true}                                                | 20    | 0.1605253696472732    | 0.6996796343095133     | 0.1802524239096693   | 0.12006794178079239    | 0.6496071691141935   |
      | Optimal ROI        | {"splitting": true}                                               | 20    | 0.16243321156107526   | 0.6996796343095133     | 0.1802524239096693   | 0.12006794178079239    | 0.5823271394100926   |
      | Optimal ROI        | {"splitting": true, "hitSplitAces": true}                         | 20    | 0.16277115111832252   | 0.6996796343095133     | 0.1802524239096693   | 0.12006794178079239    | 0.583524870460664    |
      | Optimal ROI        | {"doubling": true, "splitting": true}                             | 20    | 0.16039908017577664   | 0.6996796343095133     | 0.1802524239096693   | 0.12006794178079239    | 0.6524121630643883   |
      | Optimal ROI        | {"doubling": true, "splitting": true, "doublingAfterSplit": true} | 20    | 0.16038164550078662   | 0.6996796343095133     | 0.1802524239096693   | 0.12006794178079239    | 0.6536224142453908   |

  Scenario: Overall expected results
    Then the following overall expected results scenarios are considered
      | Hand resolver      | Rules                                                             | Probability         | Win                 | Push                 | Lose                | Edge                  |
      | 17 stand threshold | {}                                                                | 0.9999999999999499  | 0.41117520822468145 | 0.09835505186252129  | 0.49046973991272225 | -0.05674630158405397  |
      | Optimal ROI        | {}                                                                | 0.9999999999999739  | 0.42616094862698073 | 0.08446816123203774  | 0.4893708901409305  | -0.04066171140996298  |
      | Optimal ROI        | {"doubling": true}                                                | 0.9999999999999736  | 0.4261114967923677  | 0.08310311693853427  | 0.4907853862690467  | -0.031130692205260727 |
      | Optimal ROI        | {"splitting": true}                                               | 0.9999999999999738  | 0.427245424457509   | 0.08488793796783767  | 0.4878666375746021  | -0.03813498716008838  |
      | Optimal ROI        | {"splitting": true, "hitSplitAces": true}                         | 0.9999999999999737  | 0.4276171906402636  | 0.08504111612055786  | 0.4873416932391274  | -0.036341566123630084 |
      | Optimal ROI        | {"doubling": true, "splitting": true}                             | 0.9999999999999737  | 0.4271959726228961  | 0.08352289367433421  | 0.4892811337027184  | -0.02860396795538636  |
      | Optimal ROI        | {"doubling": true, "splitting": true, "doublingAfterSplit": true} | 0.9999999999999738  | 0.4271955487679424  | 0.08351119378917625  | 0.48929325744283014 | -0.02844509395702416  |
