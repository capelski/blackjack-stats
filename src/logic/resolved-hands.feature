Feature: Resolved hands

  The resolved hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Resolved hands for stand threshold
    When getting the resolved hands of a hand resolver with a stand threshold of 17
    Then 128 resolved hands are returned
    And the resolved hand 1 has label "A,A", action "hit" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.036664927049104734 |
    And the resolved hand 128 has label "22+ (3+)", action "stand" and the following actions breakdown
      | Action | Edge                 |
      | stand  | -0.9999999999999751  |
    And the resolved hand with label "15" has action "hit" and the following actions breakdown
      | Action | Edge                 |
      | stand  | -0.4368143052667273  |
      | hit    | -0.4715333170584962  |

  Scenario: Resolved hands for optimal actions
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand 1 has label "A,A", action "hit" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.011159494642067662 |
    And the resolved hand 128 has label "22+ (3+)", action "stand" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "stand" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.4659589607506597   |

  Scenario: Resolved hands for optimal actions with doubling
    Given doubling is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand with label "10" has action "double" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | 0.08563825369934375   |
      | double | 0.14370944104007732   |

  Scenario: Resolved hands for optimal actions with splitting
    Given splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.011159494642067662 |
      | split  | 0.26047086607882486   |

  Scenario: Resolved hands for optimal actions with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.011159494642067662 |
      | split  | 0.5635590212402795    |

  Scenario: Resolved hands for optimal actions with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "8,8" has action "split" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.5092809372686018   |
      | double | -1.0185618745372036   |
      | split  | -0.2814282677588305   |

  Scenario: Resolved hands for optimal actions with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "8,8" has action "split" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.5092809372686018   |
      | double | -1.0185618745372036   |
      | split  | -0.25457856203562423  |

  Scenario: Resolved hands for optimal actions with blackjack after split
    Given splitting is allowed
    And blackjack after split is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Edge                  |
      | stand  | -0.4368143052667273   |
      | hit    | -0.011159494642067662 |
      | split  | 0.627485821603456     |
