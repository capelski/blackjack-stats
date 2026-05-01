Feature: Abstract hands

  Every material hand is represented by an abstract hand with the corresponding properties

  Scenario: Abstract hands
    When getting the abstract hands
    Then 30 abstract hands are returned
    And the abstract hand 1 has label "22+", scores "22" and is not actionable
    And the abstract hand 30 has label "2/12", scores "2,12" and is actionable
    And there is a non-actionable abstract hand with label "BJ" and scores "21.5"
    And there is a non-actionable abstract hand with label "21" and scores "21"
    And there is a non-actionable abstract hand with label "11/21" and scores "11,21"
    And there is an actionable abstract hand with label "20" and scores "20"
    And there is an actionable abstract hand with label "10/20" and scores "10,20"
