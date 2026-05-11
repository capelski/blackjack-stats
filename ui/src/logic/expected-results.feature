Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Scenario: Individual expected result
    Then the following individual expected result scenarios are considered
      | Hand resolver      | Rules                                                             | Score | Probability           | Win                    | Push                 | Lose                   | Edge                   |
      | 17 stand threshold | {}                                                                | 17    | 0.14512590450523094   | 0.04086641667628575    | 0.021061528158462465 | 0.08319795967048273    | -0.042331542994196975  |
      | Optimal ROI        | {}                                                                | 15    | 0.12627279484635356   | 0.03555751584572714    | 0                    | 0.09071527900062643    | -0.055157763154899286  |
      | Optimal ROI        | {"doubling": true}                                                | 12    | 0.008169993882086286  | 0.002300611840224632   | 0                    | 0.005869382041861655   | -0.007137540403274045  |
      | Optimal ROI        | {"splitting": true}                                               | 12    | 0.0004551661356394971 | 0.00012817152815959213 | 0                    | 0.00032699460747990497 | -0.0003976461586406257 |
      | Optimal ROI        | {"splitting": true, "hitSplitAces": true}                         | 15    | 0.1268033369307789    | 0.035706912701928294   | 0                    | 0.09109642422885059    | -0.05583146114289519   |
      | Optimal ROI        | {"doubling": true, "splitting": true}                             | 12    | 0.008625160017725784  | 0.0024287833683842245  | 0                    | 0.0061963766493415605  | -0.007535186561914672  |
      | Optimal ROI        | {"doubling": true, "splitting": true, "doublingAfterSplit": true} | 12    | 0.008695185577054936  | 0.0024485020650241614  | 0                    | 0.006246683512030775   | -0.007657539226111785  |

  Scenario: Overall expected results
    Then the following overall expected results scenarios are considered
      | Hand resolver      | Rules                                                             | Probability         | Win                 | Push                 | Lose                | Edge                  |
      | 17 stand threshold | {}                                                                | 0.9999999999999499  | 0.4111752082246918  | 0.09835505186252376  | 0.49046973991273446 | -0.05674630158405533  |
      | Optimal ROI        | {}                                                                | 0.9999999999999739  | 0.4261609486269914  | 0.08446816123203983  | 0.48937089014094276 | -0.04066171140996397  |
      | Optimal ROI        | {"doubling": true}                                                | 0.9999999999999736  | 0.4261114967923784  | 0.08310311693853635  | 0.49078538626905893 | -0.031130692205261448 |
      | Optimal ROI        | {"splitting": true}                                               | 0.9999999999999738  | 0.4272454244575197  | 0.08488793796783978  | 0.4878666375746141  | -0.03813498716008934  |
      | Optimal ROI        | {"splitting": true, "hitSplitAces": true}                         | 0.9999999999999737  | 0.42761719064027426 | 0.08504111612055999  | 0.48734169323913956 | -0.03634156612363104  |
      | Optimal ROI        | {"doubling": true, "splitting": true}                             | 0.9999999999999737  | 0.4271959726229068  | 0.0835228936743363   | 0.48928113370273063 | -0.02860396795538704  |
      | Optimal ROI        | {"doubling": true, "splitting": true, "doublingAfterSplit": true} | 0.9999999999999738  | 0.42719554876795307 | 0.08351119378917836  | 0.48929325744284247 | -0.028445093957024895 |
