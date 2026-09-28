import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';
import type { Merch, MerchImage } from '@/lib/types';
import { formatMoney } from '@/lib/constants';

const merchImage = 'https://images.pexels.com/photos/35239606/pexels-photo-35239606.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/35239606/pexels-photo-35239606.jpeg?auto=compress&cs=tinysrgb&h=600&w=600';

export function MerchPage({ routeParams }: { routeParams?: Record<string, string> }) {
  if (routeParams?.id) {
    return <MerchDetailPage productId={routeParams.id} />;
  }
  return <MerchListPage />;
}

function MerchListPage() {
  useScrollReveal();
  const { data: products, loading } = useQuery<Merch>('merch', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });
  const [filter, setFilter] = useState<string>('All');

  return (
    <div>
      <PageHero
        eyebrow="Wear the movement"
        title="Women Elevation and Empowerment Initiative Merch"
        subtitle="Wear your values. Every purchase helps fund women's empowerment programs across Africa and beyond."
        image={merchImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : products && products.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 mb-8 animate-on-scroll">
                {['All', 'Clothing', 'Accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2.5 font-lato text-sm font-semibold rounded-full transition-all ${
                      filter === cat
                        ? 'bg-plum-600 text-white'
                        : 'bg-white text-charcoal-600 border border-plum-200 hover:border-plum-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {products
                  .filter((p) => filter === 'All' || p.category?.toLowerCase() === filter.toLowerCase())
                  .map((product, i) => (
                    <Card key={product.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 flex flex-col">
                      <Link to={`/merch/${product.id}`} className="flex flex-col flex-1">
                        <div className="aspect-square overflow-hidden relative" style={{ transitionDelay: `${i * 0.08}s` }}>
                          <img src={product.image_url || fallbackImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {!product.in_stock && (
                            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-charcoal-700 text-white font-lato text-xs font-semibold">Out of Stock</span>
                          )}
                        </div>
                        <div className="p-5 md:p-6 flex-1 flex flex-col">
                          {product.category && <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-1">{product.category}</span>}
                          <h3 className="font-playfair text-lg font-bold text-plum-700 mb-1">{product.name}</h3>
                          {product.description && <p className="font-lato text-xs text-charcoal-500 leading-relaxed mb-3">{product.description}</p>}
                          {product.price && <p className="font-playfair text-xl font-bold text-plum-600 mb-3">{product.price}</p>}
                          <div className="mt-auto">
                            <Button variant="primary" size="sm" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
              </div>
            </>
          ) : (
            <EmptyState title="Good Things in the Making" message="We're designing a beautiful collection of merchandise that supports our mission. Every purchase empowers a woman — our store opens soon!" />
          )}
        </div>
      </section>
    </div>
  );
}

function MerchDetailPage({ productId }: { productId: string }) {
  useScrollReveal();
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Merch | null>(null);
  const [images, setImages] = useState<MerchImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showOrder, setShowOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderForm, setOrderForm] = useState({ full_name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: prodData } = await supabase
        .from('merch')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
      if (prodData) {
        setProduct(prodData as Merch);
        const { data: imgData } = await supabase
          .from('merch_images')
          .select('*')
          .eq('merch_id', productId)
          .order('sort_order', { ascending: true });
        setImages((imgData as MerchImage[]) || []);
      }
      setLoading(false);
    })();
  }, [productId]);

  if (loading) {
    return <div className="pt-32"><SectionLoader /></div>;
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="font-lato text-charcoal-500">Product not found.</p>
        <Link to="/merch" className="inline-flex items-center gap-2 mt-4 font-lato text-sm text-plum-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Merch
        </Link>
      </div>
    );
  }

  const allImages = [product.image_url || fallbackImage, ...images.map((img) => img.image_url)].filter(Boolean) as string[];
  const sizes = product.sizes ? product.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const colors = product.colors ? product.colors.split(',').map((c) => c.trim()).filter(Boolean) : [];

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sizes.length > 0 && !selectedSize) return;
    setOrderStatus('loading');
    const { data: orderData, error: orderError } = await supabase
      .from('merch_orders')
      .insert({
        merch_id: product.id,
        merch_name: product.name,
        ...orderForm,
        size: selectedSize || null,
        color: selectedColor || null,
        quantity,
        total: product.price,
        status: 'new',
      })
      .select()
      .single();

    if (orderError) {
      setOrderStatus('error');
      return;
    }

    const { error: payError } = await supabase.from('payment_submissions').insert({
      full_name: orderForm.full_name,
      email: orderForm.email,
      phone: orderForm.phone,
      amount: product.price || '',
      source: 'merch',
      merch_id: product.id,
      order_id: orderData?.id,
      status: 'pending',
    });

    if (payError) {
      setOrderStatus('error');
      return;
    }

    setOrderStatus('success');
    setTimeout(() => {
      navigate('/payment');
    }, 1500);
  };

  return (
    <div className="bg-cream-50 min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <Link to="/merch" className="inline-flex items-center gap-2 font-lato text-sm text-plum-600 hover:text-plum-700 mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Merch
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-plum-100 shadow-sm mb-4 relative">
              <img src={allImages[activeImage] || fallbackImage} alt={product.name} className="w-full h-full object-cover" />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-plum-950/60 text-white rounded-full hover:bg-plum-950/80 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-plum-950/60 text-white rounded-full hover:bg-plum-950/80 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-plum-950/60 text-white rounded-full font-lato text-xs">
                    {activeImage + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-plum-500' : 'border-plum-100 hover:border-plum-300'}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-2 block">{product.category}</span>
            )}
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-2">{product.name}</h1>
            {product.description && <p className="font-lato text-sm text-charcoal-500 leading-relaxed mb-4">{product.description}</p>}

            {product.price && (
              <div className="mb-4">
                <p className="font-playfair text-2xl font-bold text-plum-600">{product.price}</p>
              </div>
            )}

            <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-6">
              Every purchase helps support real initiatives that empower girls through education, scholarships, and outreach programs. Wear it with pride. You are part of change.
            </p>

            {sizes.length > 0 && (
              <div className="mb-4">
                <p className="font-lato text-sm font-semibold text-charcoal-700 mb-2">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-lg font-lato text-sm font-semibold border transition-all ${
                        selectedSize === s ? 'bg-plum-600 text-white border-plum-600' : 'bg-white text-charcoal-700 border-plum-200 hover:border-plum-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mb-4">
                <p className="font-lato text-sm font-semibold text-charcoal-700 mb-2">Available Colors</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-lg font-lato text-sm font-semibold border transition-all ${
                        selectedColor === c ? 'bg-plum-600 text-white border-plum-600' : 'bg-white text-charcoal-700 border-plum-200 hover:border-plum-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!product.in_stock && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="font-lato text-sm text-red-600 font-semibold">Currently Out of Stock</p>
              </div>
            )}

            {product.in_stock && (
              <Button variant="primary" className="w-full" onClick={() => { setShowOrder(true); setOrderStatus('idle'); }}>
                Order Now <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            <div className="mt-4 bg-gold-50 border border-gold-200 rounded-2xl p-4">
              <p className="font-lato text-xs text-charcoal-600 leading-relaxed">
                All proceeds go directly to women's empowerment programs. As a non-profit, all sales are final. Thank you for your support!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order modal */}
      {showOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-plum-950/60 animate-fade-in" onClick={() => setShowOrder(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-1">Order Information</h3>
            <p className="font-lato text-sm text-charcoal-500 mb-6">{product.name}</p>

            {orderStatus === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle2 className="w-12 h-12 text-gold-400" />
                <p className="font-lato text-charcoal-700 text-center">Order received! Redirecting you to payment...</p>
              </div>
            ) : (
              <form onSubmit={submitOrder} className="space-y-4">
                {sizes.length > 0 && (
                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">
                      Your Size<span className="text-gold-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500"
                    >
                      <option value="">Select size</option>
                      {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                {colors.length > 0 && (
                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Color</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500"
                    >
                      <option value="">Select color</option>
                      {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500"
                  />
                </div>
                <Input label="Full Name" value={orderForm.full_name} onChange={(v) => setOrderForm({ ...orderForm, full_name: v })} required />
                <Input label="Email" type="email" value={orderForm.email} onChange={(v) => setOrderForm({ ...orderForm, email: v })} required />
                <Input label="Phone" value={orderForm.phone} onChange={(v) => setOrderForm({ ...orderForm, phone: v })} />
                <TextArea label="Shipping Address" value={orderForm.address} onChange={(v) => setOrderForm({ ...orderForm, address: v })} rows={2} />
                {orderStatus === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowOrder(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={orderStatus === 'loading'} className="flex-1">
                    {orderStatus === 'loading' ? 'Processing...' : 'Proceed to Payment'}
                    {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
