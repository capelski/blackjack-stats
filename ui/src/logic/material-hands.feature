Feature: Material hands

  The material hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Stand threshold material hands
    When getting the material hands of a hand resolver with a stand threshold of 17
    Then 86099 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "Hit"
    And the material hand 86099 has cards "K,K", score "20", probability "0.00591715976331361" and action "Stand"

  Scenario: Optimal ROI material hands
    When getting the material hands of a hand resolver for optimal roi
    Then 26923 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "Hit"
    And the material hand 26923 has cards "K,K", score "20", probability "0.00591715976331361" and action "Stand"
