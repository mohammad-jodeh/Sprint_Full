# 🚀 Automation Rules - Quick Start Guide

## Getting Started (2 Minutes)

### Step 1: Access Automation
1. Open any project from your dashboard
2. Look at the left sidebar
3. Click on **"Automation"** (⚡ icon) between Team and Settings

### Step 2: Create Your First Rule
Click the blue **"Create Rule"** button in the top-right

### Step 3: Fill in the Details

#### Rule Name (Required)
```
Example: "Auto-close completed work"
```

#### Description (Optional)
```
Example: "Automatically closes issues when status is set to Done"
```

#### Choose a Trigger (When this happens)
Select what event should trigger your automation:
- **Status Changed** - Triggers when someone changes an issue's status
- **Issue Created** - Triggers when a new issue is added
- **Priority Changed** - Triggers when priority is modified
- **Assignee Changed** - Triggers when assigned person changes
- **Due Date Approaching** - Triggers 2+ days before deadline
- **Issue Commented** - Triggers when someone comments

#### Configure the Trigger
Based on your selection, you may need to choose:
- **For Status Changed**: Which status triggers it?
- **For Priority Changed**: Which priority level?

#### Choose an Action (Then perform this action)
Select what should automatically happen:
- **Auto-Transition** - Move issue to a specific status
- **Auto-Assign** - Assign to a team member
- **Send Notification** - Alert someone (requires separate setup)
- **Add Comment** - Post an auto-comment
- **Create Subtask** - Generate subtask automatically
- **Send Webhook** - Call external API

#### Configure the Action
Provide action-specific details:
- **For Auto-Transition**: Which status to move to?
- **For Auto-Assign**: Which user to assign?
- **For Add Comment**: What message to post?
- **For Webhook**: What URL to call?

### Step 4: Save Your Rule
Click **"Create Rule"** button - your rule is now active!

---

## 🎯 Common Automation Recipes

### Recipe 1: Instant Final Review
**Problem**: High-priority items get lost
**Solution**: 
```
Trigger: Status Changed → To: Code Review
Action: Auto-Assign → To: Lead Developer
```

### Recipe 2: Auto-Closure for Completed Work
**Problem**: Issues pile up in "Done" status
**Solution**:
```
Trigger: Status Changed → To: Done
Action: Auto-Transition → To: Closed
```

### Recipe 3: Deadline Alerts
**Problem**: Miss upcoming deadlines
**Solution**:
```
Trigger: Due Date Approaching ← 2 days
Action: Send Notification → Project Manager
```

### Recipe 4: Automatic QA Review
**Problem**: Finished code isn't tested
**Solution**:
```
Trigger: Status Changed → To: Ready for QA
Action: Auto-Assign → To: QA Engineer
```

### Recipe 5: Sprint Intake Distribution
**Problem**: Tasks queue up unassigned
**Solution**:
```
Trigger: Issue Created → In This Sprint
Action: Auto-Assign → To: Next Available Developer
```

---

## 📊 Monitor Your Automations

### Statistics Dashboard
At the top of Automation page, see:
- **Active Rules**: How many automations are running
- **Total Executions**: How many times rules have fired
- **Success Rate**: Percentage of successful automations

### Rule Details
Each rule shows:
- ✅ Is it currently enabled?
- 🎯 What triggers it?
- ⚡ What action it performs?
- 📅 When it was created
- ⏱️ When it last ran

---

## ⚙️ Managing Rules

### Enable/Disable
Click the toggle switch (⊙) next to any rule to turn it on/off
- **Green toggle** = Rule is active
- **Gray toggle** = Rule is disabled (won't trigger)

### Edit a Rule
1. Click the **pencil icon** (✎) on the rule
2. Modify any settings
3. Click "Update Rule"

### Delete a Rule
1. Click the **trash icon** (🗑️) on the rule
2. Confirm deletion
3. Rule is permanently removed

---

## ⚡ Pro Tips

### Tip 1: Test Before Deploying
Create a rule with clear trigger conditions first. Monitor it for a day to ensure it's working as intended before expanding scope.

### Tip 2: Combine with Team Workflows
Use auto-assignment to match your team's capacity and expertise. Pair with status transitions for smooth workflow.

### Tip 3: Keep Rules Simple
Each rule should do one thing well. Multiple simple rules are better than one complex rule.

### Tip 4: Document with Descriptions
Use the description field to explain WHY the rule exists. Helpful for future team members.

### Tip 4: Monitor Success Rate
Check statistics regularly. Low success rate might indicate:
- Trigger conditions rarely match
- Action configuration issues
- Need for adjustment

---

## ❓ FAQ

### Q: Can I use automation without technical skills?
**A**: Yes! The visual interface guides you through rule creation. No coding required.

### Q: What if a rule breaks something?
**A**: Quickly disable the rule with one click using the toggle switch. Edit to fix, or delete if no longer needed.

### Q: Can multiple rules run at once?
**A**: Yes! All active rules can interact. For example:
1. Issue status changes to "Done"
2. Rule A auto-transitions to "Closed"
3. Rule B auto-assigns to Manager
4. Both happen in sequence

### Q: How often are rules checked?
**A**: Rules trigger immediately when their conditions are met. No delays.

### Q: Can I rollback a rule?
**A**: You can disable it immediately. Rules are always editable and in your version history.

### Q: Do rules work during off-hours?
**A**: Yes! Automation rules work 24/7, even when nobody is online.

---

## 🎓 Learn More

Visit the [full feature documentation](./AUTOMATION_FEATURE_COMPLETE.md) for:
- Technical architecture details
- All 6 trigger types explained
- All 6 action types detailed
- Advanced configuration options
- Best practices and patterns

---

## 🆘 Need Help?

If something isn't working:
1. Check rule is **enabled** (green toggle)
2. Verify **trigger conditions** match your use case
3. Test with a **simple rule first**
4. Check **project statistics** are updating
5. Disable rule and try **different trigger type**

Happy automating! 🚀
