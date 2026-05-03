Feature: Resolved hands

  The resolved hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Stand threshold resolved hands
    When getting the resolved hands of a hand resolver with a stand threshold of 17
    Then 30 resolved hands are returned
    And the resolved hand 1 has label "2/12", action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.4309989442283621  | 0.10133718449414611  | 0.4676638712774668  | -0.03666492704910468  |
    And the resolved hand 30 has label "22+", action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0                   | 0                    | 0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.23643754785128446 | 0.055591587238910015 | 0.7079708649097806  | -0.4715333170584962   |

  Scenario: Optimal ROI resolved hands
    When getting the resolved hands of a hand resolver for optimal roi
    Then 30 resolved hands are returned
    And the resolved hand 1 has label "2/12", action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.44988190522271815 | 0.08907669491247122  | 0.46104139986478565 | -0.011159494642067648 |
    And the resolved hand 30 has label "22+", action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0                   | 0                    | 0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.24121013983516376 | 0.05162075957898787  | 0.7071691005858234  | -0.4659589607506597   |
