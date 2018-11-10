package main

// RemoveDuplicateStrings : removes duplicates from a string slice
func RemoveDuplicateStrings(s []string) []string {
	m := make(map[string]bool)

	// cycle through values + test for unique-ness
	for _, item := range s {
		if _, ok := m[item]; !ok {
			m[item] = true
		}
	}

	// append values to new slice
	var result []string
	for item := range m {
		result = append(result, item)
	}

	return result
}

// RemoveDuplicateInts : removes duplicates from an int slice
func RemoveDuplicateInts(s []int) []int {
	m := make(map[int]bool)

	// cycle through values + test for unique-ness
	for _, item := range s {
		if _, ok := m[item]; !ok {
			m[item] = true
		}
	}

	// append values to new slice
	var result []int
	for item := range m {
		result = append(result, item)
	}

	return result
}
