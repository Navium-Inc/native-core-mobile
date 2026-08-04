import React, { useState } from "react"
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"

interface CalendarModalProps {
    visible: boolean
    onClose: () => void
    onSelectDate: (date: string) => void
    initialDate?: string
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const CalendarModal: React.FC<CalendarModalProps> = ({
    visible,
    onClose,
    onSelectDate,
    initialDate,
}) => {
    // Parse initial date or default to 2000-01-01 for Date of Birth convenience
    const parseInitialDate = () => {
        if (initialDate && initialDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [y, m, d] = initialDate.split("-").map(Number)
            return new Date(y, m - 1, d)
        }
        return new Date(2000, 0, 1) // default to Jan 1, 2000 for DOB
    }

    const [currentDate, setCurrentDate] = useState<Date>(parseInitialDate())
    const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate())
    const [mode, setMode] = useState<"calendar" | "year">("calendar")

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Helper functions for month grid calculation
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleSelectDay = (day: number) => {
        const newSelected = new Date(year, month, day)
        setSelectedDate(newSelected)
    }

    const handleSelectYear = (selectedYear: number) => {
        setCurrentDate(new Date(selectedYear, month, 1))
        setSelectedDate(new Date(selectedYear, month, Math.min(selectedDate.getDate(), getDaysInMonth(selectedYear, month))))
        setMode("calendar")
    }

    const handleConfirm = () => {
        const yyyy = selectedDate.getFullYear()
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0")
        const dd = String(selectedDate.getDate()).padStart(2, "0")
        const formatted = `${yyyy}-${mm}-${dd}`
        onSelectDate(formatted)
        onClose()
    }

    // Generate days grid
    const totalDays = getDaysInMonth(year, month)
    const firstDayIndex = getFirstDayOfMonth(year, month)

    const daysGrid: (number | null)[] = []
    for (let i = 0; i < firstDayIndex; i++) {
        daysGrid.push(null)
    }
    for (let day = 1; day <= totalDays; day++) {
        daysGrid.push(day)
    }

    // Generate years range for DOB (1940 to Current Year)
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let y = currentYear; y >= 1940; y--) {
        years.push(y)
    }

    const isSameDay = (d1: Date, dayNum: number) => {
        return (
            d1.getFullYear() === year &&
            d1.getMonth() === month &&
            d1.getDate() === dayNum
        )
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    {/* Top Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select Date of Birth</Text>
                        <Pressable onPress={() => setMode(mode === "calendar" ? "year" : "calendar")}>
                            <Text style={styles.monthYearBtn}>
                                {MONTHS[month]} {year} ▾
                            </Text>
                        </Pressable>
                    </View>

                    {mode === "calendar" ? (
                        <>
                            {/* Navigation Bar */}
                            <View style={styles.navRow}>
                                <Pressable style={styles.arrowBtn} onPress={handlePrevMonth}>
                                    <Text style={styles.arrowText}>‹</Text>
                                </Pressable>
                                <Text style={styles.monthText}>{MONTHS[month]} {year}</Text>
                                <Pressable style={styles.arrowBtn} onPress={handleNextMonth}>
                                    <Text style={styles.arrowText}>›</Text>
                                </Pressable>
                            </View>

                            {/* Days of week header */}
                            <View style={styles.weekHeader}>
                                {DAYS_OF_WEEK.map((d, i) => (
                                    <Text key={i} style={styles.weekDayText}>{d}</Text>
                                ))}
                            </View>

                            {/* Calendar Days Grid */}
                            <View style={styles.daysGrid}>
                                {daysGrid.map((day, idx) => {
                                    if (day === null) {
                                        return <View key={`empty-${idx}`} style={styles.dayCell} />
                                    }

                                    const selected = isSameDay(selectedDate, day)

                                    return (
                                        <Pressable
                                            key={`day-${day}`}
                                            style={[styles.dayCell, selected && styles.selectedDayCell]}
                                            onPress={() => handleSelectDay(day)}
                                        >
                                            <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                                                {day}
                                            </Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </>
                    ) : (
                        /* Year Selection Grid */
                        <View style={styles.yearContainer}>
                            <Text style={styles.selectYearTitle}>Select Birth Year</Text>
                            <FlatList
                                data={years}
                                keyExtractor={(item) => item.toString()}
                                numColumns={3}
                                contentContainerStyle={styles.yearGrid}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={[styles.yearCell, item === year && styles.selectedYearCell]}
                                        onPress={() => handleSelectYear(item)}
                                    >
                                        <Text style={[styles.yearText, item === year && styles.selectedYearText]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                )}
                            />
                        </View>
                    )}

                    {/* Bottom Actions */}
                    <View style={styles.actionRow}>
                        <Pressable style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>Confirm Date</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 340,
        backgroundColor: "#0B192C",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        marginBottom: 16,
        alignItems: "center",
        gap: 4,
    },
    headerTitle: {
        color: "#8FA0C0",
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    monthYearBtn: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 2,
    },
    navRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        paddingHorizontal: 8,
    },
    arrowBtn: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    arrowText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
        lineHeight: 24,
    },
    monthText: {
        color: "#40C4FF",
        fontSize: 16,
        fontWeight: "600",
    },
    weekHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    weekDayText: {
        width: 40,
        textAlign: "center",
        color: "#6B7C96",
        fontSize: 12,
        fontWeight: "600",
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    dayCell: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 2,
        borderRadius: 20,
    },
    selectedDayCell: {
        backgroundColor: "#0460FF",
    },
    dayText: {
        color: "#E2E8F0",
        fontSize: 14,
        fontWeight: "500",
    },
    selectedDayText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    yearContainer: {
        height: 240,
        marginVertical: 10,
    },
    selectYearTitle: {
        color: "#8FA0C0",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 8,
    },
    yearGrid: {
        paddingBottom: 10,
    },
    yearCell: {
        flex: 1,
        margin: 4,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    selectedYearCell: {
        backgroundColor: "#0460FF",
    },
    yearText: {
        color: "#E2E8F0",
        fontSize: 15,
        fontWeight: "600",
    },
    selectedYearText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        alignItems: "center",
    },
    cancelText: {
        color: "#A0AEC0",
        fontSize: 14,
        fontWeight: "600",
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#0460FF",
        alignItems: "center",
    },
    confirmText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
})
