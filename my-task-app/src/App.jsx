import React, { useState, useEffect } from 'react';

// 気人の定義（アイコンとカラー・ラベルの対応）
const MOODS = [
  { id: 'happy', emoji: '😊', label: '最高', bg: 'bg-amber-50 border-amber-200 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
  { id: 'neutral', emoji: '😐', label: 'ふつう', bg: 'bg-slate-50 border-slate-200 text-slate-800', badge: 'bg-slate-100 text-slate-700' },
  { id: 'sad', emoji: '😞', label: 'どんより', bg: 'bg-sky-50 border-sky-200 text-sky-900', badge: 'bg-sky-100 text-sky-800' },
];

export default function App() {
  // --- 1. 状態管理 (useState) ---
  // 日付の初期値は今日（YYYY-MM-DD形式）
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [selectedMood, setSelectedMood] = useState('happy');
  
  // よかったこと3つの入力欄（配列で管理）
  const [goodThings, setGoodThings] = useState(['', '', '']);
  
  // 保存された日記一覧（初期値は localStorage から取得、なければ空配列）
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('good_things_diary');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
      }
    }
    return [];
  });

  // フィルター用の状態（'all' または各 mood.id）
  const [filterMood, setFilterMood] = useState('all');

  // --- 2. 副作用 (useEffect) ---
  // entries が更新されるたびに localStorage に自動保存する
  useEffect(() => {
    localStorage.setItem('good_things_diary', JSON.stringify(entries));
  }, [entries]);

  // --- 3. ハンドラー関数 ---
  // よかったことの入力値変更
  const handleGoodThingChange = (index, value) => {
    const newThings = [...goodThings];
    newThings[index] = value;
    setGoodThings(newThings);
  };

  // 保存ボタン押下時
  const handleSave = (e) => {
    e.preventDefault();
    
    // 空白の項目を除外せずそのまま保存するか、空欄チェックを入れるか
    // ここではすべて空欄でなければ保存できるようにする
    if (goodThings.every((item) => item.trim() === '')) {
      alert('よかったことを少なくとも1つは入力してください！');
      return;
    }

    const newEntry = {
      id: Date.now(), // 一意のID
      date,
      mood: selectedMood,
      things: [...goodThings],
    };

    // 新しい日記を先頭に追加
    setEntries([newEntry, ...entries]);

    // フォームをリセット（日付は今日のまま、よかったことだけクリア）
    setGoodThings(['', '', '']);
  };

  // 削除ボタン押下時
  const handleDelete = (id) => {
    if (window.confirm('この日記を削除してもよいですか？')) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  // フィルターされた一覧データの取得
  const filteredEntries = entries.filter((entry) => {
    if (filterMood === 'all') return true;
    return entry.mood === filterMood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-teal-50/30 to-sky-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            ✨ はっぴー日記
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            今日の気分と、小さなハッピーを3つ残そう
          </p>
        </header>

        {/* 入力フォームカード */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-8">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* 日付と気分選択の並び */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* 日付 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  日付
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* 気分選択 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  今日の気分
                </label>
                <div className="flex gap-2">
                  {MOODS.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMood(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* よかったこと3つ入力欄 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                今日のよかったこと（3つ）
              </label>
              <div className="space-y-2.5">
                {goodThings.map((thing, index) => (
                  <div key={index} className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400 w-4">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={thing}
                      onChange={(e) => handleGoodThingChange(index, e.target.value)}
                      placeholder={`${index + 1}つ目のよかったことは？`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 保存ボタン */}
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow"
            >
              日記を保存する
            </button>
          </form>
        </section>

        {/* フィルタータブ */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-slate-700">
            これまでの記録 ({filteredEntries.length}件)
          </h2>
          <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterMood('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterMood === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              すべて
            </button>
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setFilterMood(m.id)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMood === m.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span>{m.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* タイムライン・一覧エリア */}
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">
              記録がまだありません。最初のハッピーを記録してみよう！
            </div>
          ) : (
            filteredEntries.map((entry) => {
              // 該当する気分データの取得
              const moodObj = MOODS.find((m) => m.id === entry.mood) || MOODS[0];

              return (
                <div
                  key={entry.id}
                  className={`rounded-2xl border p-5 transition-all shadow-sm ${moodObj.bg}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label="mood">
                        {moodObj.emoji}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${moodObj.badge}`}>
                        {moodObj.label}
                      </span>
                      <span className="text-xs text-slate-500 font-medium ml-1">
                        {entry.date}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors p-1"
                      title="削除"
                    >
                      ✕ 削除
                    </button>
                  </div>

                  <ul className="space-y-1.5 pl-1">
                    {entry.things.map((thing, i) => (
                      thing.trim() !== '' && (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-teal-600 font-bold text-xs mt-0.5">✓</span>
                          <span className="break-all">{thing}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}