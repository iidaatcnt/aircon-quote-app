'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Phone, Mail, Calendar, Building, Zap, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    acType: '',
    capacity: '',
    rooms: 1,
    buildingType: '',
    floor: '',
    installation: '',
    urgency: '',
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    contactMethod: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const steps = [
    { id: 1, title: "エアコン仕様", icon: <Zap className="w-5 h-5" /> },
    { id: 2, title: "設置環境", icon: <Building className="w-5 h-5" /> },
    { id: 3, title: "お客様情報", icon: <Users className="w-5 h-5" /> },
    { id: 4, title: "連絡希望", icon: <Phone className="w-5 h-5" /> }
  ];

  // 見積もり計算
  useEffect(() => {
    let basePrice = 0;
    
    // エアコンタイプによる基本料金
    const acPrices = {
      'ceiling-cassette': 180000,
      'ceiling-mounted': 150000,
      'wall-mounted': 120000,
      'floor-standing': 200000,
      'duct-type': 250000
    };
    
    basePrice = acPrices[formData.acType as keyof typeof acPrices] || 0;
    
    // 容量による価格調整
    const capacityMultiplier = {
      '2.5': 1.0,
      '4.0': 1.3,
      '5.0': 1.6,
      '6.0': 1.9,
      '8.0': 2.5,
      '10.0': 3.2
    };
    
    basePrice *= (capacityMultiplier[formData.capacity as keyof typeof capacityMultiplier] || 1);
    
    // 部屋数による追加料金
    if (formData.rooms > 1) {
      basePrice += (formData.rooms - 1) * 50000;
    }
    
    // 建物タイプによる調整
    if (formData.buildingType === 'high-rise') {
      basePrice *= 1.2;
    } else if (formData.buildingType === 'old-building') {
      basePrice *= 1.15;
    }
    
    // 階数による追加料金
    if (formData.floor === '4-6') {
      basePrice += 30000;
    } else if (formData.floor === '7+') {
      basePrice += 50000;
    }
    
    // 設置条件による調整
    if (formData.installation === 'difficult') {
      basePrice *= 1.3;
    } else if (formData.installation === 'very-difficult') {
      basePrice *= 1.5;
    }
    
    // 緊急度による調整
    if (formData.urgency === 'urgent') {
      basePrice *= 1.2;
    } else if (formData.urgency === 'emergency') {
      basePrice *= 1.5;
    }
    
    setEstimatedPrice(Math.round(basePrice));
  }, [formData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.acType && formData.capacity && formData.rooms;
      case 2:
        return formData.buildingType && formData.floor && formData.installation;
      case 3:
        return formData.companyName && formData.contactName && formData.phone && formData.email && formData.address;
      case 4:
        return formData.contactMethod && (formData.contactMethod !== 'appointment' || (formData.preferredDate && formData.preferredTime));
      default:
        return false;
    }
  };

  const submitQuote = () => {
    // 実際のアプリケーションでは、ここでサーバーにデータを送信
    console.log('見積もり送信:', formData);
    alert('見積もり依頼を送信しました。担当者より24時間以内にご連絡いたします。');
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">見積もり完了</h1>
              <p className="text-gray-600">お疲れさまでした。以下が概算見積もりです。</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-8">
              <h2 className="text-xl font-semibold mb-2">概算見積もり金額</h2>
              <div className="text-4xl font-bold">¥{estimatedPrice.toLocaleString()}</div>
              <p className="text-blue-100 mt-2">*工事費・材料費込み（税抜）</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">次のステップ</h3>
                <p className="text-gray-600">担当者が現地調査を行い、正式な見積もりをご提示いたします。</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">ご連絡について</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• 24時間以内に担当者からご連絡いたします</li>
                  <li>• 現地調査の日程を調整させていただきます</li>
                  <li>• 正式見積もりは現地調査後3営業日以内にお渡しします</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={submitQuote}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              見積もり依頼を送信
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">業務用エアコン取り付け</h1>
          <p className="text-xl text-gray-600">簡単3分で見積もり</p>
        </div>

        {/* プログレスバー */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    ステップ {step.id}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ステップ1: エアコン仕様 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">エアコンの仕様をお選びください</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">エアコンタイプ</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'ceiling-cassette', name: '天井カセット型', desc: '天井埋込み、4方向吹出し' },
                    { id: 'ceiling-mounted', name: '天吊型', desc: '天井吊下げ、省スペース' },
                    { id: 'wall-mounted', name: '壁掛型', desc: '壁面設置、コンパクト' },
                    { id: 'floor-standing', name: '床置型', desc: '床置き、パワフル' },
                    { id: 'duct-type', name: 'ダクト型', desc: '天井裏設置、静音' }
                  ].map(type => (
                    <div
                      key={type.id}
                      onClick={() => handleInputChange('acType', type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.acType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">冷房能力（kW）</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {['2.5', '4.0', '5.0', '6.0', '8.0', '10.0'].map(capacity => (
                    <button
                      key={capacity}
                      onClick={() => handleInputChange('capacity', capacity)}
                      className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                        formData.capacity === capacity
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {capacity}kW
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">設置部屋数</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleInputChange('rooms', Math.max(1, formData.rooms - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-16 text-center">{formData.rooms}部屋</span>
                  <button
                    onClick={() => handleInputChange('rooms', formData.rooms + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ステップ2: 設置環境 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">設置環境についてお教えください</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">建物タイプ</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'office', name: 'オフィスビル', desc: '一般的なオフィス' },
                    { id: 'retail', name: '店舗・商業施設', desc: '店舗、ショップ等' },
                    { id: 'factory', name: '工場・倉庫', desc: '製造業、物流施設' },
                    { id: 'high-rise', name: '高層ビル', desc: '10階建て以上' },
                    { id: 'old-building', name: '築古ビル', desc: '築20年以上' },
                    { id: 'other', name: 'その他', desc: '病院、学校等' }
                  ].map(type => (
                    <div
                      key={type.id}
                      onClick={() => handleInputChange('buildingType', type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.buildingType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">設置階数</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: '1-3', name: '1-3階' },
                    { id: '4-6', name: '4-6階' },
                    { id: '7+', name: '7階以上' },
                    { id: 'basement', name: '地下' }
                  ].map(floor => (
                    <button
                      key={floor.id}
                      onClick={() => handleInputChange('floor', floor.id)}
                      className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                        formData.floor === floor.id
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {floor.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">設置条件</label>
                <div className="space-y-3">
                  {[
                    { id: 'standard', name: '標準', desc: '一般的な設置環境' },
                    { id: 'difficult', name: 'やや困難', desc: '配管距離が長い、高所作業等' },
                    { id: 'very-difficult', name: '困難', desc: '特殊工事が必要、アクセス困難等' }
                  ].map(condition => (
                    <div
                      key={condition.id}
                      onClick={() => handleInputChange('installation', condition.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.installation === condition.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{condition.name}</h3>
                          <p className="text-sm text-gray-600">{condition.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">工事希望時期</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'normal', name: '通常（1-2ヶ月）' },
                    { id: 'urgent', name: '急ぎ（2-3週間）' },
                    { id: 'emergency', name: '緊急（1週間以内）' }
                  ].map(urgency => (
                    <button
                      key={urgency.id}
                      onClick={() => handleInputChange('urgency', urgency.id)}
                      className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                        formData.urgency === urgency.id
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {urgency.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ステップ3: お客様情報 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">お客様情報をご入力ください</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会社名・店舗名 *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="株式会社○○"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ご担当者名 *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="山田 太郎"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号 *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="03-1234-5678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">設置場所住所 *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="〒000-0000 東京都○○区○○ 1-2-3 ○○ビル 4階"
                />
              </div>
            </div>
          )}

          {/* ステップ4: 連絡希望 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ご連絡方法をお選びください</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">希望連絡方法</label>
                <div className="space-y-3">
                  {[
                    { id: 'phone', name: '電話', desc: '営業時間内にお電話いたします', icon: <Phone className="w-5 h-5" /> },
                    { id: 'email', name: 'メール', desc: '詳細な見積書をメールでお送りします', icon: <Mail className="w-5 h-5" /> },
                    { id: 'appointment', name: '訪問予約', desc: '現地調査の日時を調整します', icon: <Calendar className="w-5 h-5" /> }
                  ].map(method => (
                    <div
                      key={method.id}
                      onClick={() => handleInputChange('contactMethod', method.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.contactMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          formData.contactMethod === method.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.contactMethod === 'appointment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">希望日 *</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">希望時間帯 *</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="morning">午前（9:00-12:00）</option>
                      <option value="afternoon">午後（13:00-17:00）</option>
                      <option value="evening">夕方（17:00-19:00）</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">その他ご要望</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="設置場所の詳細、特別な要望などがあればご記入ください"
                />
              </div>
            </div>
          )}

          {/* 概算金額表示 */}
          {estimatedPrice > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">概算見積もり金額</h3>
              <div className="text-3xl font-bold">¥{estimatedPrice.toLocaleString()}</div>
              <p className="text-blue-100 text-sm mt-1">*正式な見積もりは現地調査後にご提示いたします</p>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              戻る
            </button>
            
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-8 py-3 rounded-lg font-semibold ${
                isStepValid()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? '見積もり確認' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}