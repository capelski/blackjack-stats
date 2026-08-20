Feature: Labels

  All relevant aspects of a hand are considered when generating the next label

  Scenario: Hitting an initial pair
    Given the hand label "12"
    When hitting with next card "3"
    Then the next hand label is "15 (3+)"

  Scenario: Hitting a 3+ cards
    Given the hand label "15 (3+)"
    When hitting with next card "10"
    Then the next hand label is "22+ (3+)"

  Scenario: Doubling an initial pair
    Given the hand label "11"
    When doubling with next card "3"
    Then the next hand label is "14 (D)"

  Scenario: Splitting a splittable pair
    Given the hand label "8,8"
    When splitting with next card "3"
    Then the next hand label is "11 (S)"

  Scenario: Splitting a splittable pair (A,A)
    Given the hand label "A,A"
    When splitting with next card "3"
    Then the next hand label is "4/14 (A)"

  Scenario: Hitting a post split pair
    Given the hand label "12 (S)"
    When hitting with next card "3"
    Then the next hand label is "15 (3+)"

  Scenario: Hitting a post A-split pair
    Given the hand label "2/12 (A)"
    When hitting with next card "3"
    Then the next hand label is "5/15 (3+)"
