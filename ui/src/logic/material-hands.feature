Feature: Material hands

  The material hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Material hands generation
    When getting the material hands of a hand resolver with a stand threshold of 17
    Then 86099 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.5917%" and action "Hit"
    And the material hand 86099 has cards "K,K", score "20", probability "0.5917%" and action "Stand"
