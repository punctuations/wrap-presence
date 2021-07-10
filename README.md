# 🌙 use-presence
#### An official react hook for [presence](https://presence.im).

---

### 📦 Installation

via NPM
> npm i --save use-presence

via yarn 
> yarn add use-presence

### ⌨️ Usage

----

```tsx
import { usePresence } from 'use-presence';

const Presence = () => {
	const req = {
		platform: 'twitter',
		type: 'user',
		params: 'atmattt',
	};
	
	const {data, error, isLoading} = usePresence(req);

	if (isLoading) {
		return <p>Loading...</p>
	} else if (error) {
		return <p>An error has occured!</p>
	}
	
	return data;
}
```

