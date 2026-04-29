Feature: Hand identities

  Each possible hand is represented by a single hand identity based on its key properties

  Scenario: Default hand identities
    When getting the hand identities
    Then the returned hand identities list contains 30 elements
    And the hand identity 1 has label "22+", scores "22" and is not actionable
    And the hand identity 30 has label "2/12", scores "2,12" and is actionable
    And there is a non-actionable hand identity with label "BJ" and scores "21.5"
    And there is a non-actionable hand identity with label "21" and scores "21"
    And there is a non-actionable hand identity with label "11/21" and scores "11,21"
    And there is an actionable hand identity with label "20" and scores "20"
    And there is an actionable hand identity with label "10/20" and scores "10,20"
